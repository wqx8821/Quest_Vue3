export function isObject (value: unknown) : value is Record<any, any> {
  return value instanceof Object && value !== null
}