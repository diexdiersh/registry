
# RegistryLib

RegistryLib is a NestJS module that facilitates dynamic method invocation across unrelated modules. It allows developers to manage and invoke methods from different services at runtime without requiring direct imports or tight coupling, promoting clean, modular, and scalable code.

- [RegistryLib](#registrylib)
  - [Motivation](#motivation)
  - [Features](#features)
  - [Install the Package](#install-the-package)
  - [Getting Started](#getting-started)
  - [Core Concepts](#core-concepts)
    - [RegistryService](#registryservice)
    - [@MethodProvider](#methodprovider)
    - [@ServiceProvider](#serviceprovider)
    - [How It Integrates with NestJS](#how-it-integrates-with-nestjs)
  - [When to Use RegistryLib](#when-to-use-registrylib)
    - [Good Use Cases](#good-use-cases)
    - [When to Avoid or Use with Caution](#when-to-avoid-or-use-with-caution)
  - [Compatibility](#compatibility)

## Motivation

In large-scale NestJS applications, managing dependencies across various modules often leads to tightly coupled code, complex conditional logic, and difficulties in extending functionality. As new modules are added, the need to update dependencies and ensure seamless integration becomes cumbersome.

RegistryLib addresses these challenges by providing a centralized service that manages method invocation across modules. This reduces boilerplate code, simplifies module interactions, and allows for independent module development.

## Features

- **Dynamic Method Invocation**: Invoke methods from services across different modules dynamically at runtime, without direct imports.
- **Decoupled Modules**: Enable independent module development without tight integration, keeping modules unaware of each other's implementations.
- **Simplified API**: Provides a straightforward way to manage and invoke methods from various services, reducing boilerplate logic.
- **Scalable Architecture**: Easily add or modify services without altering existing code, making your system more flexible and adaptable.

## Install the Package

You can install RegistryLib using npm/yarn/pnpm:

npm:

```sh
npm install @diexpkg/registry
```

yarn:

```sh
yarn add @diexpkg/registry
```

pnpm:

```sh
pnpm install @diexpkg/registry
```

## Getting Started

To start using RegistryLib in your NestJS application, follow these steps:

1. **Import the RegistryModule**: Include `RegistryModule` in your main application module.

    ```typescript
    import { RegistryModule } from '@diexpkg/registry';

    @Module({
        imports: [RegistryModule],
    })
    export class AppModule {}
    ```

2. **Register Services with `@ServiceProvider` and `@MethodProvider` Decorators**:
    - Use the `@ServiceProvider` decorator on your module to register it with the registry. This is necessary for any module whose services you want to invoke dynamically.
    - Use the `@MethodProvider` decorator on the service methods you want to expose. The string passed to `@MethodProvider` should be a unique identifier for that service.

    ```typescript
    import { Injectable, Module } from '@nestjs/common';
    import { MethodProvider, ServiceProvider } from '@diexpkg/registry';

    @MethodProvider('SimpleService')
    @Injectable()
    class SimpleService {
        world(): string {
            return 'world';
        }
    }

    @ServiceProvider('SimpleModule')
    @Module({ providers: [SimpleService] })
    class SimpleModule {}
    ```

3. **Invoke Methods Dynamically Using `RegistryService`**:
    - Inject `RegistryService` where needed and use it to dynamically call methods from registered services. The `graph` property in `RegistryService` represents the internal structure that holds the references to all registered services and their methods.

    ```typescript
    import { Injectable, Logger } from '@nestjs/common';
    import { RegistryService } from '@diexpkg/registry';

    @Injectable()
    class HelloService {
        private readonly _logger = new Logger();

        constructor(private readonly _registryService: RegistryService) {}

        async hello(): Promise<string> {
            const world = await this._registryService.graph.tryCall<SimpleService>({
                keys: ['SimpleModule', 'SimpleService'],
                method: 'world',
                params: [],
            });

            this._logger.log(`Hello: ${world}`);
            return world;
        }
    }
    ```

## Core Concepts

### RegistryService

The `RegistryService` is the central service that manages the registry of service methods and enables dynamic, runtime method calls. It builds a graph of all registered services and their methods during the application's initialization.

### @MethodProvider

The `@MethodProvider` decorator marks a service method that will be registered in the `RegistryService`. The string passed to the decorator should uniquely identify the service across the application.

### @ServiceProvider

The `@ServiceProvider` decorator registers a module and its services within the `RegistryService`. Only modules that need their services to be invoked dynamically require this decorator.

### How It Integrates with NestJS

`RegistryLib` integrates seamlessly with NestJS’s existing Dependency Injection system. It doesn’t replace or modify NestJS's DI but extends it by providing a dynamic invocation mechanism, allowing methods to be called based on runtime conditions rather than compile-time imports. This adds flexibility to module interaction and service usage.

## When to Use RegistryLib

### Good Use Cases

- **Large Modular Applications**: Ideal for applications with many independent modules where decoupling and dynamic interaction are important.
- **Simplifying Conditional Logic**: Helps reduce complex `if/else` or `switch` statements by dynamically invoking methods based on runtime conditions.
- **Feature Toggle Systems**: Useful in systems with feature toggles or plugins, allowing dynamic addition and invocation of services.
- **Extensible Architectures**: Perfect for applications where you frequently add or modify services, as it reduces the need to alter existing code.

### When to Avoid or Use with Caution

- **Small, Simple Applications**: The overhead might not be justified for simple applications where services are tightly integrated.
- **Performance-Sensitive Applications**: The additional layer of dynamic method invocation introduces slight overhead, which could be a concern in high-performance scenarios.
- **Debugging and Maintenance Complexity**: Dynamic invocation can complicate debugging and make the system harder to maintain, especially in large teams.
- **Hidden Dependencies**: The registry approach can obscure dependencies, making it harder for developers to understand how different parts of the system are connected.

## Compatibility

RegistryLib is compatible with NestJS versions X.X.X and above. It has been tested with the following versions:

- NestJS 10.X.X

Make sure your project is using a compatible version of NestJS to avoid potential issues.
