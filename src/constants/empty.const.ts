import { BasicGraphWrapper } from '../types'

const emptyError = new Error('Graph wrapper is Empty!')

export const EMPTY_WRAPPER: BasicGraphWrapper = {
    getMethodProviderKeys: (key) => {
        throw emptyError
    },
    tryBatchCall: (data) => {
        throw emptyError
    },
    tryCall: (data) => {
        throw emptyError
    },
}
