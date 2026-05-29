export type ClassValue = string | false | null | undefined | 0

export function cx(...values: ClassValue[]): string {
  return values.filter((v): v is string => typeof v === 'string' && v.length > 0).join(' ')
}
