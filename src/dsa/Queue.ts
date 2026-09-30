/**
 * Standard FIFO Queue implementation for regular pending packages.
 * Time Complexity:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 * - Peek: O(1)
 * - Size: O(1)
 */
export class Queue<T> {
  private items: T[] = [];
  private head: number = 0;

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
    this.head = 0;
  }

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.head];
    this.head++;

    // Periodic cleanup to avoid memory leak from sparse array
    if (this.head > 50 && this.head * 2 >= this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.head];
  }

  isEmpty(): boolean {
    return this.head >= this.items.length;
  }

  size(): number {
    return Math.max(0, this.items.length - this.head);
  }

  toArray(): T[] {
    return this.items.slice(this.head);
  }

  clear(): void {
    this.items = [];
    this.head = 0;
  }
}
