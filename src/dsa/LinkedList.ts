/**
 * Doubly Linked List for audit trail of completed deliveries.
 * Each node points to next and previous delivery record.
 * Time Complexity:
 * - Append to Tail: O(1)
 * - Prepend to Head: O(1)
 * - Traversal: O(N)
 */
export class ListNode<T> {
  public data: T;
  public id: string;
  public next: ListNode<T> | null = null;
  public prev: ListNode<T> | null = null;
  public timestamp: number;

  constructor(id: string, data: T) {
    this.id = id;
    this.data = data;
    this.timestamp = Date.now();
  }
}

export class LinkedList<T> {
  public head: ListNode<T> | null = null;
  public tail: ListNode<T> | null = null;
  private length: number = 0;

  append(id: string, data: T): ListNode<T> {
    const newNode = new ListNode(id, data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      if (this.tail) {
        this.tail.next = newNode;
      }
      this.tail = newNode;
    }
    this.length++;
    return newNode;
  }

  prepend(id: string, data: T): ListNode<T> {
    const newNode = new ListNode(id, data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
    return newNode;
  }

  deleteById(id: string): boolean {
    let current = this.head;
    while (current) {
      if (current.id === id) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }

        this.length--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  size(): number {
    return this.length;
  }

  toArray(): T[] {
    const list: T[] = [];
    let current = this.head;
    while (current) {
      list.push(current.data);
      current = current.next;
    }
    return list;
  }

  getNodes(): { id: string; data: T; hasPrev: boolean; hasNext: boolean; timestamp: number }[] {
    const nodes: { id: string; data: T; hasPrev: boolean; hasNext: boolean; timestamp: number }[] = [];
    let current = this.head;
    while (current) {
      nodes.push({
        id: current.id,
        data: current.data,
        hasPrev: current.prev !== null,
        hasNext: current.next !== null,
        timestamp: current.timestamp,
      });
      current = current.next;
    }
    return nodes;
  }
}
