import { SetMetadata } from '@nestjs/common'

export const METHOD_PROVIDER = 'METHOD_PROVIDER'

/**
 * This decorator allow to make method providers from services,
 * expected what that services exist inside module marked with ServiceProvider decorator
 *
 * @param key - unique key, under which will be defined service in Registry graph
 */
export const MethodProvider = (key: string): ClassDecorator =>
    SetMetadata(METHOD_PROVIDER, key)
