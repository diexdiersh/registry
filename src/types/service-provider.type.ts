import { Module } from '@nestjs/core/injector/module'

export type ServiceProvider = { key: string; module: Module }
