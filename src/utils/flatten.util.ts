import { Module } from '@nestjs/core/injector/module'

const flattenDeep = <T>(arr: unknown): T[] =>
    Array.isArray(arr)
        ? arr.reduce((a, b) => a.concat(flattenDeep(b)), [])
        : [arr]

export const flatten = (modules: Module[]): Module[] => {
    const checkedNames = new Set<string>()
    const checkedIds = new Set<string>()

    const unwrap = (module: Module): Module[] => {
        if (checkedIds.has(module.id)) {
            return []
        }

        if (checkedNames.has(module.name)) {
            console.warn(
                `Find module with different id, but the same name: ${module.name}!`,
            )
        }

        checkedNames.add(module.name)
        checkedIds.add(module.id)

        const modules: Module[] = [module]

        if (module.imports.size) {
            const imports = [...module.imports.values()]

            const unwrappedImports = imports.reduce(
                (prev: Module[], cur) => [...prev, ...unwrap(cur)],
                [],
            )

            modules.push(...unwrappedImports)
        }

        return modules
    }

    return flattenDeep<Module>(modules.map(unwrap))
}
