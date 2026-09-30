import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Binary, 
  ListOrdered, 
  Database, 
  Network, 
  History, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface Concept {
  id: string;
  name: string;
  category: 'Data Structure' | 'Algorithm';
  icon: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  logisticApplication: string;
  description: string;
  codeSnippet: string;
}

const DSA_CONCEPTS: Concept[] = [
  {
    id: 'graph',
    name: 'Weighted Graph (Adjacency List)',
    category: 'Data Structure',
    icon: 'Network',
    timeComplexity: { best: 'O(1)', average: 'O(deg(V))', worst: 'O(V)' },
    spaceComplexity: 'O(V + E)',
    logisticApplication: 'Models the road logistics network where delivery depots, drop-offs, and hubs are vertices (V), and road segments are weighted edges (E) with distance, speed limits, and traffic multipliers.',
    description: 'A mathematical structure consisting of a set of vertices linked by edges. In our logistics optimizer, an Adjacency List (Map<string, Edge[]>) offers optimal memory footprint and immediate neighbor queries.',
    codeSnippet: `export class WeightedGraph {
  private adjacencyList: Map<string, GraphEdge[]> = new Map();

  addEdge(from: string, to: string, weight: number, bidirectional = true) {
    this.adjacencyList.get(from)?.push({ node: to, weight });
    if (bidirectional) {
      this.adjacencyList.get(to)?.push({ node: from, weight });
    }
  }
}`,
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path Algorithm",
    category: 'Algorithm',
    icon: 'Zap',
    timeComplexity: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)' },
    spaceComplexity: 'O(V)',
    logisticApplication: 'Computes the guaranteed minimum physical travel distance or time between any warehouse and delivery destination across city traffic.',
    description: 'Greedy graph search algorithm that maintains a priority queue of unvisited nodes, iteratively relaxing adjacent edge distances until the destination node is finalized.',
    codeSnippet: `dijkstra(startNode: string, endNode: string) {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const pq = new PriorityQueue();

  distances.set(startNode, 0);
  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    const { element: current } = pq.dequeue();
    if (current === endNode) break;

    for (const neighbor of this.getNeighbors(current)) {
      const candidate = distances.get(current)! + neighbor.weight;
      if (candidate < (distances.get(neighbor.node) ?? Infinity)) {
        distances.set(neighbor.node, candidate);
        previous.set(neighbor.node, current);
        pq.enqueue(neighbor.node, candidate);
      }
    }
  }
}`,
  },
  {
    id: 'min-heap',
    name: 'Min-Heap Priority Queue',
    category: 'Data Structure',
    icon: 'Binary',
    timeComplexity: { best: 'O(1) peek', average: 'O(log N) push/pop', worst: 'O(log N)' },
    spaceComplexity: 'O(N)',
    logisticApplication: 'Guarantees urgent, emergency organ/medical parcels and strict-deadline deliveries are perpetually at the root, dispatched ahead of all standard shipments.',
    description: 'A complete binary tree maintained in a contiguous array where every parent node has a key strictly less than or equal to its child nodes.',
    codeSnippet: `export class MinHeap<T> {
  private heap: T[] = [];

  insert(item: T) {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  extractMin(): T | null {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const bottom = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.siftDown(0);
    }
    return root;
  }
}`,
  },
  {
    id: 'queue',
    name: 'Queue (FIFO - First In, First Out)',
    category: 'Data Structure',
    icon: 'ListOrdered',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(N)',
    logisticApplication: 'Standard package dispatch scheduling. The earliest booked parcel is processed in exact sequential arrival order.',
    description: 'A sequential container adhering strictly to First-In, First-Out (FIFO). Enqueue pushes to rear, Dequeue shifts from front in amortized O(1).',
    codeSnippet: `export class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  peek(): T | undefined { return this.items[0]; }
  isEmpty(): boolean { return this.items.length === 0; }
}`,
  },
  {
    id: 'stack',
    name: 'Stack (LIFO for Action Undo / Rollback)',
    category: 'Data Structure',
    icon: 'RotateCcw',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(N)',
    logisticApplication: 'Empowers dispatchers to instantly undo deletions, route reassignments, status changes, or accidental package modifications.',
    description: 'Last-In, First-Out (LIFO) collection where elements are added and removed from the identical end (top of stack).',
    codeSnippet: `export class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
}`,
  },
  {
    id: 'doubly-linked-list',
    name: 'Doubly Linked List',
    category: 'Data Structure',
    icon: 'History',
    timeComplexity: { best: 'O(1) insert/delete', average: 'O(N) search', worst: 'O(N)' },
    spaceComplexity: 'O(N)',
    logisticApplication: 'Stores the continuous delivery audit trail. Enables dispatchers to step backward and forward through timeline records seamlessly.',
    description: 'A sequential chain of nodes where each record contains references to both its previous and next neighbor in memory.',
    codeSnippet: `class Node<T> {
  data: T;
  prev: Node<T> | null = null;
  next: Node<T> | null = null;
  constructor(data: T) { this.data = data; }
}`,
  },
  {
    id: 'hash-map',
    name: 'Hash Map (Key-Value Direct Lookup)',
    category: 'Data Structure',
    icon: 'Database',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(N) collision' },
    spaceComplexity: 'O(N)',
    logisticApplication: 'Instant sub-millisecond retrieval of package details when entering or scanning a Tracking Code (e.g. PKG-1002).',
    description: 'Computes a numeric hash code from an arbitrary string key to index directly into a bucket array for constant-time read/write.',
    codeSnippet: `const packageMap = new Map<string, Package>();
packageMap.set(pkg.trackingCode, pkg);
const found = packageMap.get("PKG-1002"); // O(1) lookup`,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort (Divide & Conquer)',
    category: 'Algorithm',
    icon: 'Layers',
    timeComplexity: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N log N)' },
    spaceComplexity: 'O(N)',
    logisticApplication: 'Guarantees stable, predictable multi-attribute sorting across tens of thousands of delivery history records by timestamp, distance, or weight.',
    description: 'Recursively divides an array into halves until singletons remain, then merges sorted subarrays back into a unified sequence.',
    codeSnippet: `function mergeSort<T>(arr: T[], cmp: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid), cmp), mergeSort(arr.slice(mid), cmp), cmp);
}`,
  },
  {
    id: 'greedy-router',
    name: 'Greedy Nearest-Neighbor Multi-Stop Routing',
    category: 'Algorithm',
    icon: 'Sparkles',
    timeComplexity: { best: 'O(N²)', average: 'O(N²)', worst: 'O(N²)' },
    spaceComplexity: 'O(N)',
    logisticApplication: 'Solves vehicle payload consolidation: greedily selects the next closest delivery destination within vehicle payload capacity limits.',
    description: 'At each decision step, selects the locally optimal choice (nearest undelivered dropoff) with the expectation of achieving a globally effective route.',
    codeSnippet: `while (remainingPackages.length > 0) {
  let nearestPkg = null;
  let minDistance = Infinity;
  for (const pkg of remainingPackages) {
    const d = graph.dijkstra(currentLoc, pkg.destinationLocationId).totalDistanceKm;
    if (d < minDistance) { minDistance = d; nearestPkg = pkg; }
  }
  // Deliver nearestPkg and advance currentLoc
}`,
  },
];

export const DsaTheoryView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('graph');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>ACADEMIC DSA ARCHITECTURE REFERENCE & PROOF</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Data Structures & Algorithms Theory Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Comprehensive pedagogical breakdown of every data structure, algorithmic paradigm, and complexity boundary powering this logistics engine.
        </p>
      </div>

      {/* Complexity Matrix Overview Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            DSA Complexity Matrix Reference
          </h3>
          <p className="text-xs text-slate-500">Summary of asymptotic operational costs across all system modules</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Time: Best</th>
                <th className="py-3 px-3">Time: Average</th>
                <th className="py-3 px-3">Time: Worst</th>
                <th className="py-3 px-3">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
              {DSA_CONCEPTS.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                    {c.name}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.category === 'Algorithm' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {c.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">{c.timeComplexity.best}</td>
                  <td className="py-2.5 px-3 text-cyan-600 dark:text-cyan-400 font-bold">{c.timeComplexity.average}</td>
                  <td className="py-2.5 px-3 text-rose-500">{c.timeComplexity.worst}</td>
                  <td className="py-2.5 px-3 text-purple-600 dark:text-purple-400">{c.spaceComplexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accordion List of In-Depth Concepts */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Detailed Structure & Algorithmic Mechanics
        </h3>

        {DSA_CONCEPTS.map(concept => {
          const isExpanded = expandedId === concept.id;

          return (
            <div
              key={concept.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? '' : concept.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {concept.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {concept.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Avg Time: <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{concept.timeComplexity.average}</span> • Space: <span className="font-mono text-purple-500 font-bold">{concept.spaceComplexity}</span>
                    </p>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 space-y-5 animate-in fade-in duration-150">
                  {/* Logistic Application Box */}
                  <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs">
                    <span className="font-bold text-blue-900 dark:text-blue-200 block mb-1 uppercase tracking-wider text-[10px]">
                      Practical Logistics Application in System:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {concept.logisticApplication}
                    </p>
                  </div>

                  {/* Theoretical Explanation */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">
                      Theoretical Mechanics:
                    </span>
                    <p>{concept.description}</p>
                  </div>

                  {/* Code Implementation */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        TypeScript Core Implementation Snippet
                      </span>
                      <button
                        onClick={() => handleCopy(concept.id, concept.codeSnippet)}
                        className="flex items-center space-x-1 text-xs text-blue-600 dark:text-cyan-400 hover:underline"
                      >
                        {copiedId === concept.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === concept.id ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-mono overflow-x-auto">
                      <code>{concept.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
