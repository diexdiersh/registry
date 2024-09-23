import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { BasicGraphWrapper, RegistryGraph, TryCallData } from '../types'
import { createWrapper } from './create-wrapper.util'

type TestData = {
    methodName: string
    keys: string[]
    params: any[]
    graph: RegistryGraph
}

const generateRandomString = (length: number) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        )
    }
    return result
}

const createSyncMethod = () => {
    return () => {
        console.log(`SyncMethod call`)
        return []
    }
}

const createSyncMethodWithParams = () => {
    return (param: number) => {
        console.log(`SyncMethodWithParams call`)
        return [param]
    }
}

const createSyncMethodWithMultipleParams = () => {
    return (param1: number, param2: string) => {
        console.log(`SyncMethodWithMultipleParams call`)

        return [param1, param2]
    }
}

const createAsyncMethod = () => {
    return async () => {
        console.log(`AsyncMethod call`)

        return []
    }
}

const createAsyncMethodWithParams = () => {
    return async (param: number) => {
        console.log(`AsyncMethodWithParams call`)

        return [param]
    }
}

const genMethodMap: Record<string, any> = {
    '0': createSyncMethod,
    '1': createSyncMethodWithParams,
    '2': createSyncMethodWithMultipleParams,
    '3': createAsyncMethod,
    '4': createAsyncMethodWithParams,
}

const genParamMap: Record<string, any> = {
    '0': [],
    '1': [Math.floor(Math.random() * 5)],
    '2': [Math.floor(Math.random() * 5), generateRandomString(5)],
    '3': [],
    '4': [],
}

const generateRandomTestObject = (methodCount: number) => {
    const testObject: Record<string, any> = {}
    for (let i = 0; i < methodCount; i++) {
        const methodType = Math.floor(Math.random() * 5)
        const methodName = `method-${i}`

        testObject[methodName] = genMethodMap[methodType]
    }
    return testObject
}

const generateRandomKeys = (numKeys: number, keyLength: number) => {
    const keys: string[] = []
    for (let i = 0; i < numKeys; i++) {
        keys.push(generateRandomString(keyLength))
    }
    return keys
}

const generateGraph = (batch?: boolean) => {
    const numKeys = Math.floor(Math.random() * 6) + 4
    const keyLength = Math.floor(Math.random() * 5) + 3
    const keys = generateRandomKeys(numKeys, keyLength)

    const randomIndex = Math.floor(Math.random() * keys.length)

    let testObject: Record<string, any> = {}

    if (batch) {
        for (let i = 0; i < randomIndex; i++) {
            testObject[`obj-${i}`] = generateRandomTestObject(i + 1)
        }
    } else {
        testObject = generateRandomTestObject(randomIndex + 1)
    }
    let graph = {}
    let temp: Record<string, any> = graph

    for (let i = 0; i <= randomIndex; i++) {
        if (i === randomIndex) {
            temp[keys[i]] = {
                instance: testObject,
            }
        } else {
            temp[keys[i]] = {}
            temp = temp[keys[i]]
        }
    }
    return {
        obj: graph,
        keyPath: keys.slice(0, randomIndex + 2),
        value: testObject,
    }
}

const generateTestData = (batch?: boolean): TestData => {
    const { keyPath, obj, value } = generateGraph()

    const methodNames = Object.keys(value)

    const randomIndex = Math.floor(Math.random() * methodNames.length)

    const [targetMethod] = methodNames.slice(randomIndex, randomIndex + 1) as [
        string,
    ]

    const [_, methodType] = targetMethod.split('-') as [string, string]

    const params = genParamMap[methodType]

    return { keys: keyPath, methodName: targetMethod, params, graph: obj }
}

const NUM_TESTS = 2

describe.skip('createWrapper - synth', () => {
    let tryCallData: TestData[] = []
    // let tryBatchCall: TestData[] = []

    for (let i = 0; i < NUM_TESTS; i++) {
        tryCallData.push(generateTestData())
        // tryBatchCall.push(generateTestData(true))
    }

    test.concurrent.each(tryCallData)('tryCall %#', async (data) => {
        const { graph, keys, methodName, params } = data

        const wrapper = createWrapper(graph)

        const tryCallData = {
            method: methodName,
            keys,
            params,
        } as TryCallData<any, string>

        try {
            const result = await wrapper.tryCall<any>(tryCallData)
            // expect(result).toBe(true)
            console.log(`result: ${JSON.stringify(result)}`)
        } catch (error) {
            console.log(`Error: ${(error as Error).message}`)

            // expect(error).toEqual(new Error(`${methodName} error`))
        }
    })

    // test.concurrent.each(testData)(
    //     'tryBatchCall with %o',
    //     async ({ methodName, keys, params }) => {
    // const batchKeys = keys.slice(0, -1)
    // try {
    //     const results = await wrapper.tryBatchCall<typeof testObject>({
    //         method: methodName as keyof typeof testObject,
    //         keys: batchKeys,
    //         params,
    //     })
    //     expect(results).toEqual([true])
    // } catch (error) {
    //     expect(error).toEqual(new Error(`${methodName} error`))
    // }
    //     },
    // )
})

enum PathKeys {
    KEY1 = 'KEY1',
    KEY2 = 'KEY2',
}

const basicObj = {
    method: () => {
        return 42
    },
    methodWithParam: (params: any[]) => {
        return params
    },
}
const basicGraph: RegistryGraph = {
    [PathKeys.KEY1]: {
        [PathKeys.KEY1]: {
            instance: basicObj,
        } as InstanceWrapper,
        [PathKeys.KEY2]: {
            instance: basicObj,
        } as InstanceWrapper,
    },
}

describe('createWrapper - manual', () => {
    const wrapper: BasicGraphWrapper = createWrapper(basicGraph)

    test('tryCall', async () => {
        const result1 = await wrapper.tryCall<typeof basicObj>({
            method: 'method',
            keys: [PathKeys.KEY1, PathKeys.KEY2],
            params: [],
        })

        expect(result1).toBe(basicObj.method())

        const params = generateRandomKeys(2, 2)

        const result2 = await wrapper.tryCall<typeof basicObj>({
            method: 'methodWithParam',
            keys: [PathKeys.KEY1, PathKeys.KEY2],
            params: [params],
        })

        expect(result2).toBe(params)
    })

    test('tryBatchCall', async () => {
        const result = await wrapper.tryBatchCall<typeof basicObj>({
            method: 'method',
            keys: [PathKeys.KEY1],
            params: [],
        })

        const value = basicObj.method()
        expect(result.map((v) => v === value).includes(false)).toBe(false)

        const params = generateRandomKeys(2, 2)

        const result2 = await wrapper.tryBatchCall<typeof basicObj>({
            method: 'methodWithParam',
            keys: [PathKeys.KEY1],
            params: [params],
        })

        expect(result2.map((v) => Object.is(v, params)).includes(false)).toBe(
            false,
        )
    })
})
