import { Module } from '@nestjs/common'
import { DiscoveryModule, ModulesContainer } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'

import { flatten } from './flatten.util'

@Module({})
class tmA {}
@Module({})
class tmB {}
@Module({ imports: [tmA, tmB] })
class tmC {}
@Module({ imports: [tmD] })
class tmD {}

@Module({ imports: [tmD, tmB, tmA] })
class tmE {}

describe('utils', () => {
    let emptyModuleRef: TestingModule

    let moduleRef: TestingModule

    let emptyModulesContainer: ModulesContainer
    let modulesContainer: ModulesContainer

    beforeEach(async () => {
        emptyModuleRef = await Test.createTestingModule({
            imports: [DiscoveryModule],
        }).compile()

        moduleRef = await Test.createTestingModule({
            imports: [DiscoveryModule, tmE, tmD, tmC],
        }).compile()

        modulesContainer = moduleRef.get<ModulesContainer>(ModulesContainer)
        emptyModulesContainer =
            emptyModuleRef.get<ModulesContainer>(ModulesContainer)
    })

    test('flatten', () => {
        const modules = [...modulesContainer.values()]

        const flattenModules = flatten(modules)

        const emptyFlatten = flatten([...emptyModulesContainer.values()])

        expect(flattenModules.length - emptyFlatten.length).toBe(5)
    })
})
