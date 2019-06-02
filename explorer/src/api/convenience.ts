const shorten = (hash: string): string =>
    hash.length > 11
        ? `${hash.substring(0, 6)}~~${hash.substring(hash.length - 3)}`
        : hash

const delay = <T>(ms: number, value: T): Promise<T> =>
    new Promise(resolve => setTimeout(() => resolve(value), ms))

export { shorten, delay }
