import { expect, test } from 'bun:test'
import type { ChangeEvent, KeyboardEvent, ReactElement } from 'react'
import { NumberField, type NumberFieldProps } from '../src/components/NumberField'

type InputProps = Record<string, unknown>
type InputElement = ReactElement<InputProps>

function renderInput(props: NumberFieldProps): InputElement {
  const field = NumberField(props) as unknown as ReactElement<{ children: InputElement }>
  return field.props.children
}

function withActiveElement(activeElement: unknown, run: () => void) {
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { activeElement },
  })

  try {
    run()
  } finally {
    if (previousDocument === undefined) {
      Reflect.deleteProperty(globalThis, 'document')
    } else {
      Object.defineProperty(globalThis, 'document', previousDocument)
    }
  }
}

type RefElement = InputElement & { ref?: unknown }
type WheelListener = (event: WheelEvent) => void

function inputRef(input: InputElement): (node: HTMLInputElement | null) => void {
  const ref = input.props.ref ?? (input as RefElement).ref
  if (typeof ref !== 'function') throw new Error('NumberField input did not expose a ref callback')
  return ref as (node: HTMLInputElement | null) => void
}

function attachWheelListener(input: InputElement) {
  let listener: WheelListener | undefined
  let options: boolean | AddEventListenerOptions | undefined
  let removedListener: WheelListener | undefined
  let focusOptions: FocusOptions | undefined
  const ref = inputRef(input)
  const target = {
    value: '4',
    focus: (nextOptions?: FocusOptions) => {
      focusOptions = nextOptions
    },
    addEventListener: (
      type: string,
      nextListener: EventListenerOrEventListenerObject,
      nextOptions?: boolean | AddEventListenerOptions,
    ) => {
      if (type !== 'wheel') return
      listener = nextListener as WheelListener
      options = nextOptions
    },
    removeEventListener: (type: string, nextListener: EventListenerOrEventListenerObject) => {
      if (type !== 'wheel') return
      removedListener = nextListener as WheelListener
    },
  } as HTMLInputElement

  ref(target)
  if (listener === undefined) throw new Error('NumberField did not attach a wheel listener')

  return {
    target,
    get options() {
      return options
    },
    get focusOptions() {
      return focusOptions
    },
    dispatchWheel(event: Pick<WheelEvent, 'deltaY' | 'preventDefault'>) {
      listener?.(event as WheelEvent)
    },
    detach() {
      ref(null)
    },
    get removedListener() {
      return removedListener
    },
    get listener() {
      return listener
    },
  }
}

test('NumberField renders as a spinner-free decimal spinbutton', () => {
  const input = renderInput({ value: 12.5, onChange: () => {} })

  expect(input.props.type).toBe('text')
  expect(input.props.inputMode).toBe('decimal')
  expect(input.props.role).toBe('spinbutton')
  expect(input.props.value).toBe('12.5')
  expect(input.props['aria-valuenow']).toBe(12.5)
})

test('NumberField accepts decimal numbers and rejects nonnumeric text', () => {
  const changes: Array<number | null> = []
  const input = renderInput({ value: 12, onChange: (next) => changes.push(next) })
  const onChange = input.props.onChange as (event: ChangeEvent<HTMLInputElement>) => void
  const invalidTarget = { value: '12abc' } as HTMLInputElement

  onChange({ currentTarget: { value: '13.5' } as HTMLInputElement } as ChangeEvent<HTMLInputElement>)
  onChange({ currentTarget: invalidTarget } as ChangeEvent<HTMLInputElement>)

  expect(changes).toEqual([13.5])
  expect(invalidTarget.value).toBe('12')
})

test('NumberField steps with arrow keys and clamps to bounds', () => {
  const changes: Array<number | null> = []
  const input = renderInput({
    value: 10,
    onChange: (next) => changes.push(next),
    min: 0,
    max: 10.25,
    step: 0.5,
  })
  const onKeyDown = input.props.onKeyDown as (event: KeyboardEvent<HTMLInputElement>) => void
  let prevented = false

  onKeyDown({
    key: 'ArrowUp',
    preventDefault: () => {
      prevented = true
    },
  } as KeyboardEvent<HTMLInputElement>)

  expect(prevented).toBe(true)
  expect(changes).toEqual([10.25])
})

test('NumberField steps with wheel while focused and prevents page scrolling', () => {
  const changes: Array<number | null> = []
  const input = renderInput({ value: 4, onChange: (next) => changes.push(next), step: 0.25 })
  const wheel = attachWheelListener(input)
  let prevented = false

  expect((wheel.options as AddEventListenerOptions).passive).toBe(false)

  withActiveElement(wheel.target, () => {
    wheel.dispatchWheel({
      deltaY: -120,
      preventDefault: () => {
        prevented = true
      },
    })
  })

  expect(prevented).toBe(true)
  expect(wheel.focusOptions?.preventScroll).toBe(true)
  expect(changes).toEqual([4.25])
})

test('NumberField removes its native wheel listener on ref detach', () => {
  const input = renderInput({ value: 4, onChange: () => {} })
  const wheel = attachWheelListener(input)
  const attachedListener = wheel.listener

  wheel.detach()

  expect(wheel.removedListener).toBe(attachedListener)
})

test('NumberField wheel under the pointer steps even before the input is focused', () => {
  const changes: Array<number | null> = []
  const input = renderInput({ value: 4, onChange: (next) => changes.push(next), step: 0.25 })
  const wheel = attachWheelListener(input)
  let prevented = false

  withActiveElement({ value: 'other' }, () => {
    wheel.dispatchWheel({
      deltaY: -120,
      preventDefault: () => {
        prevented = true
      },
    })
  })

  expect(prevented).toBe(true)
  expect(wheel.focusOptions?.preventScroll).toBe(true)
  expect(changes).toEqual([4.25])
})

test('NumberField focused readOnly wheel prevents page scrolling without changing value', () => {
  const changes: Array<number | null> = []
  const input = renderInput({ value: 4, onChange: (next) => changes.push(next), readOnly: true })
  const wheel = attachWheelListener(input)
  let prevented = false

  withActiveElement(wheel.target, () => {
    wheel.dispatchWheel({
      deltaY: -120,
      preventDefault: () => {
        prevented = true
      },
    })
  })

  expect(prevented).toBe(true)
  expect(changes).toEqual([])
})
