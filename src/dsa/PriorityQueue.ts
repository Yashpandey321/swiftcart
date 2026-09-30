/**
 * Binary Min-Heap implementation for Urgent Packages and Dijkstra priority queue.
 * In Min-Heap: Parent is always <= Children.
 * Time Complexity:
 * - Insert: O(log N)
 * - ExtractMin: O(log N)
 * - Peek: O(1)
 */
export interface HeapNode<T> {
  item: T;
  priority: number; // Smaller number = higher priority (e.g. deadline minutes or distance)
  key: string;
}

export class MinHeap<T> {
  private heap: HeapNode<T>[] = [];
  public operationLog: string[] = [];

  constructor(initialNodes?: { item: T; priority: number; key: string }[]) {
    if (initialNodes && initialNodes.length > 0) {
      for (const node of initialNodes) {
        this.insert(node.item, node.priority, node.key);
      }
    }
  }

  private parentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private leftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private rightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  insert(item: T, priority: number, key: string): void {
    const node: HeapNode<T> = { item, priority, key };
    this.heap.push(node);
    this.operationLog.push(`Inserted "${key}" with priority ${priority} at index ${this.heap.length - 1}`);
    this.heapifyUp(this.heap.length - 1);
  }

  private heapifyUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = this.parentIndex(current);
      if (this.heap[current].priority < this.heap[parent].priority) {
        this.swap(current, parent);
        this.operationLog.push(
          `HeapifyUp: Swapped index ${current} (priority ${this.heap[parent].priority}) with parent ${parent} (priority ${this.heap[current].priority})`
        );
        current = parent;
      } else {
        break;
      }
    }
  }

  extractMin(): HeapNode<T> | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) {
      const root = this.heap.pop()!;
      this.operationLog.push(`ExtractMin: Removed solitary root node "${root.key}" (priority: ${root.priority})`);
      return root;
    }

    const min = this.heap[0];
    const last = this.heap.pop()!;
    this.heap[0] = last;
    this.operationLog.push(`ExtractMin: Replaced root with last element "${last.key}", now running HeapifyDown`);
    this.heapifyDown(0);
    return min;
  }

  private heapifyDown(index: number): void {
    let current = index;
    const length = this.heap.length;

    while (this.leftChildIndex(current) < length) {
      const left = this.leftChildIndex(current);
      const right = this.rightChildIndex(current);
      let smallest = current;

      if (this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }

      if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }

      if (smallest !== current) {
        this.swap(current, smallest);
        this.operationLog.push(
          `HeapifyDown: Swapped index ${current} with child ${smallest} (priorities: ${this.heap[smallest].priority} <-> ${this.heap[current].priority})`
        );
        current = smallest;
      } else {
        break;
      }
    }
  }

  peek(): HeapNode<T> | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  getHeapArray(): HeapNode<T>[] {
    return [...this.heap];
  }

  clear(): void {
    this.heap = [];
    this.operationLog = [];
  }
}
