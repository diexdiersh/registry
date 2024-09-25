import { CustomError } from '../classes'

export const ERROR_KEYS_EMPTY = () =>
    new CustomError('Keys array should have at least one value!')

export const ERROR_KEYS_INVALID = (expect: number, real: number) =>
    new CustomError(`Keys should have ${expect} values, but have ${real}`)

export const ERROR_KEY_INVALID = (key: string) =>
    new CustomError(`Key ${key} is invalid!`)

export const ERROR_METHOD_INVALID = (method: string) =>
    new CustomError(`Method ${method} is invalid!`)
