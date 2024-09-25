import { SetMetadata } from '@nestjs/common'

export const SERVICE_PROVIDER = 'SERVICE_PROVIDER'

/**
 * @param key - unique key, under which will be defined container with method providers in Registry graph
 */
// TODO: Make key parameter optional, if not set use name of class
export const ServiceProvider = (key: string): ClassDecorator =>
    SetMetadata(SERVICE_PROVIDER, key)
