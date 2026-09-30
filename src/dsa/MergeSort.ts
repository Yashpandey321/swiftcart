import { MergeSortStep } from '../types';

/**
 * Merge Sort implementation with Step-by-Step Visualization Tracing.
 * Divide and Conquer Algorithm:
 * - Divide array into two halves: O(1)
 * - Recursively sort two halves: 2 * T(N/2)
 * - Merge two sorted halves: O(N)
 * Time Complexity: O(N log N) in all cases (best, average, worst).
 * Space Complexity: O(N) auxiliary space.
 */

export interface SortableItem {
  id: string;
  label: string;
  value: number | string;
  meta?: any;
}

export interface MergeSortResult {
  sortedList: SortableItem[];
  steps: MergeSortStep[];
  comparisonsCount: number;
  recursionDepth: number;
}

export class MergeSorter {
  private steps: MergeSortStep[] = [];
  private comparisons: number = 0;
  private maxDepth: number = 0;

  sort(items: SortableItem[], ascending: boolean = true): MergeSortResult {
    this.steps = [];
    this.comparisons = 0;
    this.maxDepth = 0;

    const initialSnapshot = items.map(item => ({ ...item }));
    this.steps.push({
      step: 0,
      phase: 'split',
      arraySnapshot: initialSnapshot,
      description: `Initial unsorted array of ${items.length} items. Starting recursive Divide and Conquer.`,
    });

    const sortedList = this.recursiveMergeSort(initialSnapshot, 0, ascending);

    this.steps.push({
      step: this.steps.length,
      phase: 'complete',
      arraySnapshot: sortedList,
      description: `Merge Sort complete! Total items: ${items.length}, total comparisons: ${this.comparisons}, max tree depth: ${this.maxDepth}.`,
    });

    return {
      sortedList,
      steps: this.steps,
      comparisonsCount: this.comparisons,
      recursionDepth: this.maxDepth,
    };
  }

  private recursiveMergeSort(arr: SortableItem[], depth: number, ascending: boolean): SortableItem[] {
    if (depth > this.maxDepth) {
      this.maxDepth = depth;
    }

    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    this.steps.push({
      step: this.steps.length,
      phase: 'split',
      arraySnapshot: [...arr],
      leftSlice: [...left],
      rightSlice: [...right],
      description: `[Depth ${depth}] Split array of ${arr.length} items into Left (${left.length}) and Right (${right.length}) halves.`,
    });

    const sortedLeft = this.recursiveMergeSort(left, depth + 1, ascending);
    const sortedRight = this.recursiveMergeSort(right, depth + 1, ascending);

    return this.merge(sortedLeft, sortedRight, depth, ascending);
  }

  private merge(left: SortableItem[], right: SortableItem[], depth: number, ascending: boolean): SortableItem[] {
    const merged: SortableItem[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      this.comparisons++;
      const valLeft = left[i].value;
      const valRight = right[j].value;

      let isLeftSmaller: boolean;
      if (typeof valLeft === 'number' && typeof valRight === 'number') {
        isLeftSmaller = ascending ? valLeft <= valRight : valLeft >= valRight;
      } else {
        isLeftSmaller = ascending 
          ? String(valLeft).localeCompare(String(valRight)) <= 0 
          : String(valLeft).localeCompare(String(valRight)) >= 0;
      }

      if (isLeftSmaller) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }
    }

    // Append remaining elements
    while (i < left.length) {
      merged.push(left[i]);
      i++;
    }
    while (j < right.length) {
      merged.push(right[j]);
      j++;
    }

    this.steps.push({
      step: this.steps.length,
      phase: 'merge',
      arraySnapshot: [...merged],
      leftSlice: [...left],
      rightSlice: [...right],
      mergedSlice: [...merged],
      description: `[Depth ${depth}] Merged sorted halves [${left.map(l => l.value).join(', ')}] & [${right.map(r => r.value).join(', ')}] into [${merged.map(m => m.value).join(', ')}].`,
    });

    return merged;
  }
}

export function mergeSort<T>(arr: T[], cmp: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) return [...arr];
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), cmp);
  const right = mergeSort(arr.slice(mid), cmp);

  const merged: T[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (cmp(left[i], right[j]) <= 0) {
      merged.push(left[i++]);
    } else {
      merged.push(right[j++]);
    }
  }

  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);

  return merged;
}
