/**
 * Dynamic Array / Vector data structure.
 * Demonstrates contiguous memory modeling, dynamic geometric resizing (doubling),
 * and O(1) random-access indexing.
 */
export interface ReallocationEvent {
  oldCapacity: number;
  newCapacity: number;
  timestamp: number;
  triggerElementCount: number;
}

export class Vector<T> {
  private buffer: (T | null)[];
  private currentSize: number = 0;
  private currentCapacity: number;
  public reallocationHistory: ReallocationEvent[] = [];

  constructor(initialCapacity: number = 4) {
    this.currentCapacity = Math.max(2, initialCapacity);
    this.buffer = new Array(this.currentCapacity).fill(null);
  }

  get(index: number): T | null {
    if (index < 0 || index >= this.currentSize) {
      throw new RangeError(`Vector index out of bounds: ${index}, size: ${this.currentSize}`);
    }
    return this.buffer[index];
  }

  set(index: number, value: T): void {
    if (index < 0 || index >= this.currentSize) {
      throw new RangeError(`Vector index out of bounds: ${index}, size: ${this.currentSize}`);
    }
    this.buffer[index] = value;
  }

  push(element: T): number {
    if (this.currentSize >= this.currentCapacity) {
      this.resize(this.currentCapacity * 2);
    }
    const insertIndex = this.currentSize;
    this.buffer[insertIndex] = element;
    this.currentSize++;
    return insertIndex;
  }

  pop(): T | null {
    if (this.currentSize === 0) return null;
    this.currentSize--;
    const element = this.buffer[this.currentSize];
    this.buffer[this.currentSize] = null;
    return element;
  }

  removeAt(index: number): T | null {
    if (index < 0 || index >= this.currentSize) return null;
    const removed = this.buffer[index];
    // Shift elements left to preserve contiguous memory
    for (let i = index; i < this.currentSize - 1; i++) {
      this.buffer[i] = this.buffer[i + 1];
    }
    this.buffer[this.currentSize - 1] = null;
    this.currentSize--;
    return removed;
  }

  private resize(newCapacity: number): void {
    const oldCap = this.currentCapacity;
    const newBuffer = new Array(newCapacity).fill(null);
    for (let i = 0; i < this.currentSize; i++) {
      newBuffer[i] = this.buffer[i];
    }
    this.buffer = newBuffer;
    this.currentCapacity = newCapacity;

    this.reallocationHistory.push({
      oldCapacity: oldCap,
      newCapacity,
      timestamp: Date.now(),
      triggerElementCount: this.currentSize,
    });
  }

  size(): number {
    return this.currentSize;
  }

  capacity(): number {
    return this.currentCapacity;
  }

  loadFactor(): number {
    return this.currentCapacity > 0 ? this.currentSize / this.currentCapacity : 0;
  }

  toArray(): T[] {
    return (this.buffer.slice(0, this.currentSize) as T[]);
  }

  getRawBuffer(): (T | null)[] {
    return [...this.buffer];
  }

  findIndex(predicate: (item: T) => boolean): number {
    for (let i = 0; i < this.currentSize; i++) {
      const item = this.buffer[i];
      if (item !== null && predicate(item)) {
        return i;
      }
    }
    return -1;
  }
}
