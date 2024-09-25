import {
    Controller,
    Get,
    Injectable,
    Logger,
    Module,
    OnApplicationBootstrap,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
    MethodProvider,
    RegistryModule,
    RegistryService,
    ServiceProvider,
} from '../../src'

// Step 1: Define a simple service with a method to be dynamically invoked.
// The @MethodProvider decorator registers the method 'world' under 'SimpleService'.
@MethodProvider('SimpleService')
@Injectable()
class SimpleService {
    world(): string {
        return 'world'
    }
}

// Step 2: Define a module that provides the SimpleService.
// The @ServiceProvider decorator registers the module in the RegistryService.
@ServiceProvider('SimpleModule')
@Module({ providers: [SimpleService] })
class SimpleModule {}

// Step 3: Define a service that will dynamically invoke methods from the registry.
// This service implements OnApplicationBootstrap to demonstrate method invocation during app startup.
@Injectable()
class HelloService implements OnApplicationBootstrap {
    private readonly _logger = new Logger(HelloService.name)

    constructor(private readonly _registryService: RegistryService) {}

    // Called when the application is bootstrapped
    async onApplicationBootstrap(): Promise<void> {
        const world = await this.hello()
        this._logger.log(`Hello: ${world}`)
    }

    // Dynamically invoke the 'world' method of SimpleService via the RegistryService
    async hello(): Promise<string> {
        // Use the graph property of RegistryService to dynamically call the 'world' method
        const world = await this._registryService.graph.tryCall<SimpleService>({
            keys: ['SimpleModule', 'SimpleService'], // Identifies the module and service
            method: 'world', // The method to invoke
            params: [], // No parameters needed for this method
        })

        return world
    }
}

// Step 4: Define a controller that exposes an endpoint to trigger the dynamic method invocation.
@Controller('hello')
class HelloController {
    constructor(private readonly _helloService: HelloService) {}

    // GET /hello - This endpoint triggers the hello() method of HelloService
    @Get()
    world(): Promise<string> {
        return this._helloService.hello()
    }
}

// Step 5: Define the main application module.
@Module({
    imports: [SimpleModule, RegistryModule], // Import both the custom and registry modules
    providers: [HelloService], // Provide the HelloService
    controllers: [HelloController], // Register the HelloController
})
class AppModule {}

// Step 6: Bootstrap the application.
async function main() {
    const app = await NestFactory.create(AppModule)
    await app.listen(3010, () => {
        console.log('Server is running on http://localhost:3010')
    })
}

main()
