import { Global, Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'

import { RegistryService } from './services'

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [RegistryService],
    exports: [RegistryService],
})
export class RegistryModule {}
