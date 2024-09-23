import { TryCallError } from '../classes'

export const isTryCallError = (value: any): value is TryCallError =>
    'isTryCallError' in value
