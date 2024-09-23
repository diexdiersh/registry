import { Injectable, Logger, OnModuleInit, Type } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { Module } from '@nestjs/core/injector/module'

import { EMPTY_WRAPPER } from '../constants'
import { METHOD_PROVIDER, SERVICE_PROVIDER } from '../decorators'
import {
    BasicGraphWrapper,
    RegistryGraph,
    ServiceContainer,
    ServiceProvider,
} from '../types'
import { createWrapper, flatten } from '../utils'

@Injectable()
export class RegistryService implements OnModuleInit {
    private _graph: RegistryGraph = {}

    public graph: BasicGraphWrapper = EMPTY_WRAPPER

    private readonly _logger = new Logger(RegistryService.name)

    constructor(private readonly _modules: ModulesContainer) {}

    onModuleInit(): void {
        this._logger.log('Start collect all service providers...')

        const serviceProviders = this._allServiceProviders()

        const str = serviceProviders.map((k) => `\t${k.key}\n`)

        this._logger.log(
            `Found ${serviceProviders.length} service providers. \n${str}`,
        )

        this._graph = this._buildGraph(serviceProviders)

        this.graph = createWrapper(this._graph)

        const graphStr = Object.entries(this._graph)
            .map(([key, container]) => {
                const containerStr = Object.keys(container).map(
                    (serviceKey) => `\t\t| -==> ${serviceKey}\n`,
                )

                return `\t${key}\n${containerStr}`
            })
            .join('\n')

        this._logger.log(`Registry graph builded! \n${graphStr}`)
    }

    private _buildGraph(serviceProviders: ServiceProvider[]): RegistryGraph {
        const graph: RegistryGraph = {}

        for (const serviceProvider of serviceProviders) {
            const container: ServiceContainer = {}

            const { key, module } = serviceProvider

            if (graph[key]) {
                throw new Error(
                    `Module, service provider with key ${key} already exist!`,
                )
            }

            this._logger.verbose(
                `Process ${serviceProvider.key} service provider...`,
            )

            const allServices = [...module.providers.values()]

            const methodProviders = allServices.filter((s) =>
                this._hasMetadata(s, METHOD_PROVIDER),
            )

            for (const methodProvider of methodProviders) {
                const serviceKey = this._getMetadata(
                    (methodProvider.instance as Function).constructor,
                    METHOD_PROVIDER,
                )

                if (container[serviceKey]) {
                    throw new Error(
                        `Service container already have one with key: ${serviceKey}, Module: ${key}`,
                    )
                }

                this._logger.verbose(
                    `Process ${methodProvider.name} method provider...`,
                )

                container[serviceKey] = methodProvider
            }

            graph[key] = container
        }

        return graph
    }

    private _allServiceProviders(): ServiceProvider[] {
        const allModules = [...this._modules.values()]

        const flattenedModules = flatten(allModules)

        const filteredModules = flattenedModules.filter((m) =>
            this._hasMetadata(m, SERVICE_PROVIDER),
        )

        return filteredModules.map(
            (m) =>
                ({
                    key: this._getMetadata(m.metatype, SERVICE_PROVIDER),
                    module: m,
                } as ServiceProvider),
        )
    }

    private _hasMetadata(
        wrapper: InstanceWrapper<any> | Module,
        metadataKey: string,
    ): boolean {
        return (
            wrapper.instance &&
            wrapper.metatype &&
            !!Reflect.getOwnMetadata(metadataKey, wrapper.metatype)
        )
    }

    private _getMetadata<T = any>(
        target: Function | Type<T>,
        metadataKey: string,
    ): T {
        return Reflect.getOwnMetadata(metadataKey, target) as T
    }
}
