type Func = (...params: any) => any | (() => any)

export type ExtractMethods<T> = {
    [K in keyof T]: T[K] extends Func ? T[K] : never
}

export type NonCallableKeys<T> = {
    [K in keyof T]: T[K] extends Func ? never : K
}[keyof T]

export type NonCallableProperties<T> = {
    [K in NonCallableKeys<T>]: T[K]
}
