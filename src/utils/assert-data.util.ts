import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

import {
    ERROR_KEYS_EMPTY,
    ERROR_KEYS_INVALID,
    ERROR_KEY_INVALID,
    ERROR_METHOD_INVALID,
} from '../constants'
import { RegistryGraph, ServiceContainer, TryCallData } from '../types'

export const assertData = (
    graph: RegistryGraph,
    data: TryCallData<any, any>,
): InstanceWrapper => {
    const { keys, method } = data

    if (!keys.length) {
        throw ERROR_KEYS_EMPTY()
    }

    if (keys.length < 2) {
        throw ERROR_KEYS_INVALID(2, keys.length)
    }

    let checkGraph: any = { ...graph }

    for (const key of keys) {
        if (!checkGraph[key]) {
            throw ERROR_KEY_INVALID(key)
        } else {
            checkGraph = checkGraph[key]
        }
    }

    const target = checkGraph as InstanceWrapper
    if (
        !('instance' in target) ||
        typeof target.instance[method] !== 'function'
    ) {
        throw ERROR_METHOD_INVALID(method as string)
    }

    return target
}
export const assertBatchData = (
    graph: RegistryGraph,
    data: TryCallData<any, any>,
): ServiceContainer => {
    const { keys, method } = data

    if (!keys.length) {
        throw ERROR_KEYS_EMPTY()
    }

    let checkGraph: any = { ...graph }

    for (const key of keys) {
        if (!checkGraph[key]) {
            throw ERROR_KEY_INVALID(key)
        } else {
            checkGraph = { ...checkGraph[key] }
        }
    }

    const targets = checkGraph as ServiceContainer

    const targetsWithMethods: ServiceContainer = Object.keys(targets).reduce(
        (acc, key) => {
            const haveMethod =
                typeof targets[key].instance[method] === 'function'

            if (!haveMethod) {
                return acc
            }

            acc[key] = targets[key]

            return acc
        },
        {} as ServiceContainer,
    )

    if (!Object.keys(targetsWithMethods).length) {
        throw ERROR_METHOD_INVALID(method as string)
    }

    return targetsWithMethods
}
