import { Logger } from '@nestjs/common'

import {
    BasicGraphWrapper,
    ExtractMethods,
    RegistryGraph,
    TryCallData,
    UnwrapPromise,
} from '../types'
import { assertBatchData, assertData } from '../utils'

export class GraphWrapper implements BasicGraphWrapper {
    private readonly _logger = new Logger(GraphWrapper.name)

    constructor(private readonly _graph: RegistryGraph) {}

    getMethodProviderKeys(serviceProviderKey: string): string[] {
        const methodProviders = this._graph[serviceProviderKey]

        if (!methodProviders) {
            return []
        }

        return Object.keys(methodProviders)
    }

    async tryCall<
        T,
        M extends keyof ExtractMethods<T> = keyof ExtractMethods<T>,
    >(
        data: TryCallData<T, M>,
    ): Promise<UnwrapPromise<ReturnType<ExtractMethods<T>[M]>>> {
        const { method } = data

        const target = assertData(this._graph, data)

        this._logger.verbose(
            `${this.tryCall.name} method ${String(method)} for keys: ${
                data.keys
            }...`,
        )

        if ('params' in data) {
            return target.instance[method](...(data.params as any[]))
        } else {
            return target.instance[method]()
        }
    }
    async tryBatchCall<
        T,
        M extends keyof ExtractMethods<T> = keyof ExtractMethods<T>,
    >(
        data: TryCallData<T, M>,
    ): Promise<UnwrapPromise<ReturnType<ExtractMethods<T>[M]>>[]> {
        const { method } = data

        const targetsWithMethods = assertBatchData(this._graph, data)

        this._logger.verbose(
            `${this.tryBatchCall.name} method ${String(method)} for keys: ${
                data.keys
            }...`,
        )

        if ('params' in data) {
            return Object.keys(targetsWithMethods).map((key) =>
                targetsWithMethods[key].instance[method](
                    ...(data.params as any[]),
                ),
            )
        } else {
            return Object.keys(targetsWithMethods).map((key) =>
                targetsWithMethods[key].instance[method](),
            )
        }
    }
}
