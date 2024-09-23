import { ExtractMethods } from './extract-methods.type'
import { UnwrapPromise } from './unwrap-promise.type'

export type BasicGraphWrapper = {
    getMethodProviderKeys(serviceProviderKey: string): string[]
    tryCall: TryCallFunc
    tryBatchCall: TryBatchCallFunc
}

// type AdjustNever<T> = T extends [] ? never : T

export type TryCallData<
    T,
    M extends keyof ExtractMethods<T> = keyof ExtractMethods<T>,
> = {
    keys: string[]
    method: M
    params: Parameters<ExtractMethods<T>[M]>
}

export type TryCallFunc = <
    T,
    M extends keyof ExtractMethods<T> = keyof ExtractMethods<T>,
>(
    data: TryCallData<T, M>,
) => Promise<UnwrapPromise<ReturnType<ExtractMethods<T>[M]>>>

export type TryBatchCallFunc = <
    T,
    M extends keyof ExtractMethods<T> = keyof ExtractMethods<T>,
>(
    data: TryCallData<T, M>,
) => Promise<UnwrapPromise<ReturnType<ExtractMethods<T>[M]>>[]>
