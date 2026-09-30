/**
 * Custom Hash Map with Separate Chaining for O(1) Package Lookup.
 * Demonstrates:
 * - Hash code computation (Polynomial DJB2-like rolling hash)
 * - Modulo mapping to bucket array
 * - Collision resolution using linked bucket chains
 * - Lookup instrumentation (bucket index, collision count, chain traversal step)
 */
export interface HashEntry<V> {
  key: string;
  value: V;
}

export interface LookupReport<V> {
  found: boolean;
  value?: V;
  bucketIndex: number;
  hashCode: number;
  comparisons: number;
  chainLength: number;
  explanation: string;
}

export class HashMap<V> {
  private bucketCount: number;
  private buckets: HashEntry<V>[][];
  private totalEntries: number = 0;

  constructor(bucketCount: number = 8) {
    this.bucketCount = bucketCount;
    this.buckets = Array.from({ length: bucketCount }, () => []);
  }

  /**
   * DJB2 hashing algorithm to compute integer hash code
   */
  public computeHash(key: string): number {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) + hash) + key.charCodeAt(i); // hash * 33 + c
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private getBucketIndex(hashCode: number): number {
    return hashCode % this.bucketCount;
  }

  put(key: string, value: V): { bucketIndex: number; collided: boolean } {
    const hash = this.computeHash(key);
    const index = this.getBucketIndex(hash);
    const bucket = this.buckets[index];

    // Check if key already exists in bucket
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket[i].value = value;
        return { bucketIndex: index, collided: bucket.length > 1 };
      }
    }

    // New insertion
    bucket.push({ key, value });
    this.totalEntries++;
    return { bucketIndex: index, collided: bucket.length > 1 };
  }

  get(key: string): V | undefined {
    const report = this.lookup(key);
    return report.value;
  }

  lookup(key: string): LookupReport<V> {
    const hash = this.computeHash(key);
    const bucketIndex = this.getBucketIndex(hash);
    const bucket = this.buckets[bucketIndex];

    let comparisons = 0;
    for (let i = 0; i < bucket.length; i++) {
      comparisons++;
      if (bucket[i].key === key) {
        return {
          found: true,
          value: bucket[i].value,
          bucketIndex,
          hashCode: hash,
          comparisons,
          chainLength: bucket.length,
          explanation: `Key "${key}" hashed to code ${hash}. Modulo ${this.bucketCount} => Bucket [${bucketIndex}]. Found item in chain at position ${i} after ${comparisons} comparison(s).`,
        };
      }
    }

    return {
      found: false,
      bucketIndex,
      hashCode: hash,
      comparisons,
      chainLength: bucket.length,
      explanation: `Key "${key}" hashed to code ${hash}. Modulo ${this.bucketCount} => Bucket [${bucketIndex}]. Traversed entire chain (${bucket.length} items); key not found.`,
    };
  }

  remove(key: string): boolean {
    const hash = this.computeHash(key);
    const bucketIndex = this.getBucketIndex(hash);
    const bucket = this.buckets[bucketIndex];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this.totalEntries--;
        return true;
      }
    }
    return false;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  size(): number {
    return this.totalEntries;
  }

  getBuckets(): { index: number; entries: HashEntry<V>[] }[] {
    return this.buckets.map((entries, index) => ({
      index,
      entries: [...entries],
    }));
  }

  getStats(): {
    bucketCount: number;
    totalEntries: number;
    loadFactor: number;
    emptyBuckets: number;
    maxChainLength: number;
    collisionCount: number;
  } {
    let emptyBuckets = 0;
    let maxChainLength = 0;
    let collisionCount = 0;

    for (const bucket of this.buckets) {
      if (bucket.length === 0) {
        emptyBuckets++;
      } else {
        if (bucket.length > 1) {
          collisionCount += bucket.length - 1;
        }
        if (bucket.length > maxChainLength) {
          maxChainLength = bucket.length;
        }
      }
    }

    return {
      bucketCount: this.bucketCount,
      totalEntries: this.totalEntries,
      loadFactor: this.totalEntries / this.bucketCount,
      emptyBuckets,
      maxChainLength,
      collisionCount,
    };
  }

  clear(): void {
    this.buckets = Array.from({ length: this.bucketCount }, () => []);
    this.totalEntries = 0;
  }
}
