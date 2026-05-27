import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import {
	CadViewerFrame,
	DARK_BG,
	LIGHT_BG,
	StateText,
	displayMessage,
	resolvedStatus,
	useCadTheme,
} from "./CadViewerFrame";
import styles from "./CadViewer.module.css";
import type { CadStepViewerProps } from "./CadViewerTypes";

interface OcctMesh {
	name: string;
	color?: [number, number, number] | null;
	attributes: {
		position: { array: ArrayLike<number> };
		normal?: { array: ArrayLike<number> };
	};
	index: { array: ArrayLike<number> };
}

interface OcctResult {
	success: boolean;
	error?: string;
	meshes?: OcctMesh[];
}

function typedFloat32(values: ArrayLike<number>): Float32Array {
	return values instanceof Float32Array
		? values
		: new Float32Array(Array.from(values));
}

function typedUint32(values: ArrayLike<number>): Uint32Array {
	return values instanceof Uint32Array
		? values
		: new Uint32Array(Array.from(values));
}

async function loadStepMesh(
	meshUrl: string,
	signal: AbortSignal,
): Promise<OcctResult> {
	const response = await fetch(meshUrl, { signal });
	if (!response.ok)
		throw new Error(`Mesh request failed with HTTP ${response.status}`);
	return (await response.json()) as OcctResult;
}

export function CadStepViewer({
	meshUrl = null,
	status,
	error = null,
	emptyMessage = "No STEP model preview",
	loadingMessage = "Tessellating STEP model",
	title,
	metadata,
	download = null,
	theme,
	className,
	style,
}: CadStepViewerProps) {
	const mountRef = useRef<HTMLDivElement>(null);
	const { frameRef, activeTheme } = useCadTheme(theme);
	const [runtimeStatus, setRuntimeStatus] = useState<string | null>(null);
	const sceneBg = activeTheme === "light" ? LIGHT_BG : DARK_BG;
	const edgeColor = activeTheme === "light" ? 0x1a1a1a : 0x000000;
	const currentStatus = resolvedStatus(meshUrl, status);
	const message =
		runtimeStatus ??
		displayMessage(currentStatus, error, emptyMessage, loadingMessage);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount || currentStatus !== "ready") return;
		if (meshUrl === null || meshUrl.length === 0) return;

		setRuntimeStatus(loadingMessage);

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(sceneBg);

		const width = Math.max(mount.clientWidth, 1);
		const height = Math.max(mount.clientHeight, 1);
		const camera = new THREE.PerspectiveCamera(
			45,
			width / height,
			0.001,
			100000,
		);
		camera.position.set(0, 0, 5);

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({ antialias: true });
		} catch {
			setRuntimeStatus("WebGL renderer not available.");
			return;
		}
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		mount.appendChild(renderer.domElement);

		scene.add(new THREE.AmbientLight(0xffffff, 0.5));
		const dir = new THREE.DirectionalLight(0xffffff, 1);
		dir.position.set(1, 2, 3);
		scene.add(dir);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;

		let frameId = 0;
		const animate = () => {
			frameId = requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};
		animate();

		const observer = new ResizeObserver(() => {
			if (mount.clientWidth === 0 || mount.clientHeight === 0) return;
			camera.aspect = mount.clientWidth / mount.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(mount.clientWidth, mount.clientHeight);
		});
		observer.observe(mount);

		const abortController = new AbortController();
		const loadedMeshes: THREE.Mesh[] = [];
		const loadedEdges: THREE.LineSegments[] = [];

		void loadStepMesh(meshUrl, abortController.signal)
			.then((data) => {
				if (abortController.signal.aborted) return;
				if (!data.success) {
					setRuntimeStatus(
						`STEP parse failed${data.error ? `: ${data.error}` : ""}`,
					);
					return;
				}

				const meshes = data.meshes ?? [];
				if (meshes.length === 0) {
					setRuntimeStatus("STEP model did not contain renderable meshes");
					return;
				}

				const box = new THREE.Box3();

				for (const mesh of meshes) {
					const geometry = new THREE.BufferGeometry();
					geometry.setAttribute(
						"position",
						new THREE.BufferAttribute(
							typedFloat32(mesh.attributes.position.array),
							3,
						),
					);
					geometry.setIndex(
						new THREE.BufferAttribute(typedUint32(mesh.index.array), 1),
					);
					if (mesh.attributes.normal !== undefined) {
						geometry.setAttribute(
							"normal",
							new THREE.BufferAttribute(
								typedFloat32(mesh.attributes.normal.array),
								3,
							),
						);
					} else {
						geometry.computeVertexNormals();
					}

					const [red, green, blue] = mesh.color ?? [0.4, 0.53, 0.67];
					const material = new THREE.MeshPhongMaterial({
						color: new THREE.Color(red, green, blue),
						specular: new THREE.Color(0.1, 0.1, 0.1),
						shininess: 40,
						polygonOffset: true,
						polygonOffsetFactor: 4,
						polygonOffsetUnits: 4,
					});
					const obj = new THREE.Mesh(geometry, material);
					loadedMeshes.push(obj);
					scene.add(obj);
					box.expandByObject(obj);

					const edgesGeometry = new THREE.EdgesGeometry(geometry, 20);
					const edgesMaterial = new THREE.LineBasicMaterial({
						color: edgeColor,
					});
					const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
					loadedEdges.push(edges);
					scene.add(edges);
				}

				if (!box.isEmpty()) {
					const center = box.getCenter(new THREE.Vector3());
					const size = box.getSize(new THREE.Vector3()).length();
					camera.position.copy(center).add(new THREE.Vector3(0, 0, size * 1.5));
					camera.near = size * 0.01;
					camera.far = size * 100;
					camera.updateProjectionMatrix();
					controls.target.copy(center);
					controls.update();
				}

				setRuntimeStatus(null);
			})
			.catch((loadError: unknown) => {
				if (loadError instanceof Error && loadError.name === "AbortError")
					return;
				setRuntimeStatus(
					`Error: ${loadError instanceof Error ? loadError.message : String(loadError)}`,
				);
			});

		return () => {
			abortController.abort();
			cancelAnimationFrame(frameId);
			observer.disconnect();
			controls.dispose();
			for (const mesh of loadedMeshes) {
				mesh.geometry.dispose();
				(mesh.material as THREE.Material).dispose();
			}
			for (const edges of loadedEdges) {
				edges.geometry.dispose();
				(edges.material as THREE.Material).dispose();
			}
			if (mount.contains(renderer.domElement))
				mount.removeChild(renderer.domElement);
			renderer.dispose();
		};
	}, [currentStatus, loadingMessage, meshUrl, sceneBg, edgeColor]);

	return (
		<CadViewerFrame
			title={title}
			metadata={metadata}
			download={download}
			className={className}
			style={style}
			frameRef={frameRef}
			theme={activeTheme}
		>
			<div ref={mountRef} className={styles.mount} />
			<StateText
				message={message}
				isError={
					currentStatus === "error" || message?.startsWith("Error:") === true
				}
			/>
		</CadViewerFrame>
	);
}
