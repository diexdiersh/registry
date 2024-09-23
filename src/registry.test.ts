import { INestApplication, Injectable, Logger, Module } from '@nestjs/common'

import { DiscoveryModule } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { MethodProvider, ServiceProvider } from './decorators'
import { RegistryService } from './services/registry.service'

@Injectable()
@MethodProvider('TestServiceA')
class TestServiceA {}

@Injectable()
@MethodProvider('TestServiceB')
class TestServiceB {}

@Module({
    providers: [TestServiceA],
})
@ServiceProvider('TestModuleA')
class TestModuleA {}

@Module({
    imports: [TestModuleA],
    providers: [TestServiceB],
})
@ServiceProvider('TestModuleB')
class TestModuleB {}

const testGraph = {
    TestModuleA: {
        TestServiceA,
    },
    TestModuleB: {
        TestServiceB,
    },
}

describe('RegistryService', () => {
    let app: INestApplication

    let registryService: RegistryService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [DiscoveryModule, TestModuleB],
            providers: [RegistryService],
        }).compile()

        registryService = moduleRef.get<RegistryService>(RegistryService)

        app = moduleRef.createNestApplication()

        app.useLogger(new Logger())
    })

    test('onModuleInit', async () => {
        await app.init()

        const buildedGraph = registryService['_graph']

        expect(buildedGraph).toBeDefined()

        const serviceProviderKeys = Object.keys(buildedGraph)

        const testKeys = Object.keys(testGraph)

        const isGraphIncorrect = serviceProviderKeys
            .map((k) => {
                if (!testKeys.includes(k)) {
                    return false
                }

                const methodProvidersKey = Object.keys(buildedGraph[k])

                const testServicesKeys = Object.keys((testGraph as any)[k])

                return methodProvidersKey.map((k) =>
                    testServicesKeys.includes(k),
                )
            })
            .includes(false)

        if (isGraphIncorrect) {
            console.warn(
                `Seems like graph is incorrect: ${JSON.stringify(
                    buildedGraph,
                )}`,
            )
        }

        expect(isGraphIncorrect).toBe(false)
    })
})
