// A simple, generic object pool.
export class Pool<T extends object> {
    private _pool: T[];
    private _factory: () => T;

    constructor(factory: () => T, initialSize: number = 0) {
        this._factory = factory;
        this._pool = [];
        for (let i = 0; i < initialSize; i++) {
            this._pool.push(this._factory());
        }
    }

    /**
     * Get an object from the pool. If the pool is empty, a new object is created.
     * @returns An object of type T.
     */
    get(): T {
        if (this._pool.length > 0) {
            return this._pool.pop()!;
        }
        return this._factory();
    }

    /**
     * Return an object to the pool for later reuse.
     * @param item The object to release.
     */
    release(item: T) {
        // In a more complex pool, you might reset the object's state here.
        // For this implementation, we assume the object's state is completely
        // overwritten when it's retrieved from the pool.
        this._pool.push(item);
    }
    
    /**
     * The number of inactive objects currently available in the pool.
     */
    get size(): number {
        return this._pool.length;
    }

    /**
     * Pre-warms the pool with a specified number of objects.
     * @param count The number of objects to add to the pool.
     */
    prewarm(count: number) {
        for (let i = 0; i < count; i++) {
            this._pool.push(this._factory());
        }
    }
}
