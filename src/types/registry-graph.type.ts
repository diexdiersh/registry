import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

export type ServiceContainer<
    T = any,
    KService extends string = string,
> = Record<KService, InstanceWrapper<T>>

export type RegistryGraph<
    T = any,
    KKeys extends [string, string] = [string, string],
> = Record<KKeys[0], ServiceContainer<T, KKeys[1]>>
