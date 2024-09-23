type Func = (...params: any) => any | (() => any)

export type ExtractMethods<T> = {
    [K in keyof T]: T[K] extends Func ? T[K] : never
}
