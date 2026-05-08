import { expect, test } from 'bun:test'
import type {
  ThemeProviderProps,
  PanelProps,
  TabsProps,
  TabItem,
  ToolbarProps,
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  IconButtonProps,
  TextFieldProps,
  NumberFieldProps,
  SelectProps,
  SelectOption,
  CheckboxProps,
  ToggleProps,
  ModalProps,
  ModalSize,
  StatusBadgeProps,
  StatusVariant,
  ResultProps,
  ResultStatus,
  LogViewProps,
  WorkbenchLayoutProps,
} from '../src/index'

// Type-level smoke: all exports resolve. Runtime check: basic instantiation.
test('all component types are importable', () => {
  // Verify type shapes at runtime by constructing minimal valid objects.
  const themeProps: ThemeProviderProps = { theme: 'dark', children: null }
  expect(themeProps.theme).toBe('dark')

  const panelProps: PanelProps = { children: null }
  expect(panelProps.children).toBeNull()

  const tabItem: TabItem = { value: 'x', label: 'X' }
  const tabsProps: TabsProps = { items: [tabItem], value: 'x', onChange: () => {} }
  expect(tabsProps.value).toBe('x')

  const toolbarProps: ToolbarProps = { children: null }
  expect(toolbarProps.children).toBeNull()

  const variant: ButtonVariant = 'primary'
  const btnSize: ButtonSize = 'md'
  const buttonProps: ButtonProps = { variant, size: btnSize }
  expect(buttonProps.variant).toBe('primary')

  const iconBtnProps: IconButtonProps = { icon: '⚙', title: 'settings' }
  expect(iconBtnProps.title).toBe('settings')

  const tfProps: TextFieldProps = { value: '', onChange: () => {} }
  expect(tfProps.value).toBe('')

  const nfProps: NumberFieldProps = { value: null, onChange: () => {} }
  expect(nfProps.value).toBeNull()

  const opt: SelectOption = { value: 'a', label: 'A' }
  const selectProps: SelectProps = { options: [opt], value: null, onChange: () => {} }
  expect(selectProps.value).toBeNull()

  const cbProps: CheckboxProps = { checked: false, onChange: () => {} }
  expect(cbProps.checked).toBe(false)

  const toggleProps: ToggleProps = { value: true, onChange: () => {} }
  expect(toggleProps.value).toBe(true)

  const modalSize: ModalSize = 'lg'
  const modalProps: ModalProps = { open: false, onClose: () => {}, children: null, size: modalSize }
  expect(modalProps.open).toBe(false)

  const sv: StatusVariant = 'ok'
  const sbProps: StatusBadgeProps = { variant: sv }
  expect(sbProps.variant).toBe('ok')

  const rs: ResultStatus = 'warn'
  const resultProps: ResultProps = { label: 'L', value: 1, status: rs }
  expect(resultProps.label).toBe('L')

  const lvProps: LogViewProps = { lines: ['line1'] }
  expect(lvProps.lines[0]).toBe('line1')

  const wbProps: WorkbenchLayoutProps = {
    rail: null,
    setupPanel: null,
    diagramPanel: null,
    analysisPanel: null,
    resultsPanel: null,
  }
  expect(wbProps.railWidth).toBeUndefined()
})

test('named exports are present', async () => {
  const mod = await import('../src/index')
  const expected = [
    'ThemeProvider',
    'Panel',
    'Tabs',
    'Toolbar',
    'Button',
    'IconButton',
    'TextField',
    'NumberField',
    'Select',
    'Checkbox',
    'Toggle',
    'Modal',
    'Dialog',
    'StatusBadge',
    'Result',
    'LogView',
    'WorkbenchLayout',
  ]
  for (const name of expected) {
    expect(typeof (mod as Record<string, unknown>)[name]).toBe('function')
  }
})
