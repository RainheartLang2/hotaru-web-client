export type Selector = {
    dependsOn: string[]
    get: (map: Map<string, any>) => any
}