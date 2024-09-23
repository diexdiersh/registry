import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'

export type MethodProvider = { key: string; instance: InstanceWrapper }
