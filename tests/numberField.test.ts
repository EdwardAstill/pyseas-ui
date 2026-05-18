import { expect, test } from 'bun:test'
import type { ChangeEvent, KeyboardEvent, ReactElement, WheelEvent } from 'react'
import { NumberField, type NumberFieldProps } from '../src/components/NumberField'

type InputProps = Record<string, unknown>
type InputElement = ReactElement<InputProps>

function renderInput(props: NumberFieldProps): InputElement {
  const field = NumberField(props) as unknown as ReactElement<{ children: InputElement }>
  return field.props.children
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

test('NumberField steps with wheel only while focused', () => {
  const changes: Array<number | null> = []
  const input = renderInput({ value: 4, onChange: (next) => changes.push(next), step: 0.25 })
  const onWheel = input.props.onWheel as (event: WheelEvent<HTMLInputElement>) => void
  const target = { value: '4' } as HTMLInputElement
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
  let prevented = false

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { activeElement: target },
  })

  try {
    onWheel({
      currentTarget: target,
      deltaY: -120,
      preventDefault: () => {
        prevented = true
      },
    } as WheelEvent<HTMLInputElement>)
  } finally {
    if (previousDocument === undefined) {
      Reflect.deleteProperty(globalThis, 'document')
    } else {
      Object.defineProperty(globalThis, 'document', previousDocument)
    }
  }

  expect(prevented).toBe(true)
  expect(changes).toEqual([4.25])
})
