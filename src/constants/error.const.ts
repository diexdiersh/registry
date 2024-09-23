import { TryCallError } from '../classes'

export const ERROR_KEYS_EMPTY = new TryCallError(
    'Keys array should have at least one value!',
)

export const ERROR_KEYS_INVALID = (expect: number, real: number) =>
    new TryCallError(`Keys should have ${expect} values, but have ${real}`)

export const ERROR_KEY_INVALID = (key: string) =>
    new TryCallError(`Key ${key} is invalid!`)

export const ERROR_METHOD_INVALID = (method: string) =>
    new TryCallError(`Method ${method} is invalid!`)
