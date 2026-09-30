import { UndoAction } from '../types';

/**
 * LIFO Stack implementation for Multi-Level Undo Operations.
 * Time Complexity:
 * - Push: O(1)
 * - Pop: O(1)
 * - Peek: O(1)
 */
export class Stack<T = UndoAction> {
  private items: T[] = [];
  private maxCapacity: number;

  constructor(maxCapacity: number = 50) {
    this.maxCapacity = maxCapacity;
  }

  push(item: T): void {
    if (this.items.length >= this.maxCapacity) {
      // Remove oldest action from bottom
      this.items.shift();
    }
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    // Return top-of-stack first
    return [...this.items].reverse();
  }

  clear(): void {
    this.items = [];
  }
}
