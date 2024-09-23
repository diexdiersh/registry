import { GraphWrapper } from '../classes'
import { RegistryGraph } from '../types'

export const createWrapper = (graph: RegistryGraph): GraphWrapper => {
    return new GraphWrapper(graph)
}
