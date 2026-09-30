import React from 'react';
import { X, BookOpen, Clock, HardDrive, Cpu, CheckCircle2 } from 'lucide-react';

interface DsaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DsaGuideModal: React.FC<DsaGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const dsaItems = [
    {
      title: "Weighted Graph",
      category: "Graph Data Structure",
      timeComp: "V Nodes, E Edges",
      spaceComp: "O(V + E) Adjacency List, O(V²) Matrix",
      role: "Models physical transit topology. Nodes represent distribution hubs, warehouses, and customer addresses. Weighted edges represent roads with distance, speed limits, and real-time traffic factors.",
      methods: "addNode(), addEdge(), getAdjacencyList(), getAdjacencyMatrix()",
    },
    {
      title: "Dijkstra's Algorithm",
      category: "Greedy Graph Algorithm",
      timeComp: "O((V + E) log V) with Min-Heap",
      spaceComp: "O(V) for distances and predecessors",
      role: "Calculates the mathematically optimal shortest delivery path between any two locations, accounting for traffic multipliers and road speeds.",
      methods: "dijkstra(startNode, targetNode) with step-by-step relaxation trace",
    },
    {
      title: "Min-Heap / Priority Queue",
      category: "Tree / Heap Structure",
      timeComp: "Insert: O(log N) | Extract-Min: O(log N) | Peek: O(1)",
      spaceComp: "O(N) contiguous array backing",
      role: "Schedules urgent, perishable, or medical deliveries. Packages with earliest deadlines or highest urgency ratings bubble to the root for immediate dispatch.",
      methods: "insert(), extractMin(), heapifyUp(), heapifyDown()",
    },
    {
      title: "FIFO Queue",
      category: "Sequential Queue Structure",
      timeComp: "Enqueue: O(1) | Dequeue: O(1) | Peek: O(1)",
      spaceComp: "O(N)",
      role: "Manages regular, non-urgent pending shipments in strict order of arrival (First-In, First-Out), preventing starvation.",
      methods: "enqueue(), dequeue(), peek(), toArray()",
    },
    {
      title: "Dynamic Vector / Array",
      category: "Contiguous Array",
      timeComp: "Index Access: O(1) | Push: Amortized O(1) | Remove: O(N)",
      spaceComp: "O(Capacity), geometric doubling x2",
      role: "Stores primary master package registry with random-access indexed lookups. Demonstrates memory block reservations and geometric reallocations.",
      methods: "get(i), set(i, val), push(item), removeAt(i), resize()",
    },
    {
      title: "Doubly Linked List",
      category: "Linked Structure",
      timeComp: "Append/Prepend: O(1) | Traversal: O(N)",
      spaceComp: "O(N) with next and prev pointers",
      role: "Maintains an immutable chronological audit trail of completed deliveries. Supports bidirectional timeline browsing.",
      methods: "append(), prepend(), deleteById(), getNodes()",
    },
    {
      title: "LIFO Stack",
      category: "Stack Structure",
      timeComp: "Push: O(1) | Pop: O(1) | Peek: O(1)",
      spaceComp: "O(N) bounded undo stack",
      role: "Powers multi-level Undo operations for actions like package creation, road additions, dispatches, and status updates.",
      methods: "push(action), pop(), peek(), clear()",
    },
    {
      title: "Hash Map (Separate Chaining)",
      category: "Associative Array",
      timeComp: "Average: O(1) | Worst Case: O(N) on collision",
      spaceComp: "O(Buckets + N)",
      role: "Instant package lookup by tracking code. Computes DJB2 polynomial hash modulo bucket count, resolving collisions via linked bucket chains.",
      methods: "put(key, val), lookup(key), remove(key), getBuckets()",
    },
    {
      title: "Merge Sort",
      category: "Divide & Conquer Sorting",
      timeComp: "O(N log N) Best, Average, and Worst",
      spaceComp: "O(N) auxiliary space",
      role: "Sorts package rosters deterministically by weight, priority, deadline, or creation time with guaranteed stability.",
      methods: "sort(items, ascending) with recursive split and merge trace",
    },
    {
      title: "Greedy Dispatch Strategy",
      category: "Greedy Heuristic",
      timeComp: "O(K * (V + E log V)) for K stops",
      spaceComp: "O(V + N)",
      role: "Selects the locally optimal delivery sequence for multi-stop vehicle itineraries, balancing proximity, vehicle capacity, and urgency.",
      methods: "planGreedyRoute(graph, vehicle, packages)",
    },
    {
      title: "BFS & DFS Graph Traversal",
      category: "Graph Exploration Algorithms",
      timeComp: "O(V + E)",
      spaceComp: "O(V) queue/stack",
      role: "BFS discovers closest hubs layer-by-layer; DFS explores deep logistical corridors and checks overall network connectivity.",
      methods: "bfs(startNode), dfs(startNode)",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                DSA Theory & Complexity Guide
              </h2>
              <p className="text-xs text-slate-500">
                Formal Data Structures & Algorithms specifications implemented in this application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3.5 text-xs text-indigo-900 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">Academic Rigor: </span>
              Every data structure and algorithm in this project has been built with explicit, transparent TypeScript classes rather than relying solely on built-in native helpers. You can inspect runtime memory, internal pointers, heap arrays, hash buckets, and step-by-step traces.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dsaItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-xs transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2 text-[11px]">
                  <div className="flex items-center space-x-1.5 text-slate-600 bg-slate-50 p-1.5 rounded">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{item.timeComp}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600 bg-slate-50 p-1.5 rounded">
                    <HardDrive className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{item.spaceComp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-1.5 mb-2">
                  {item.role}
                </p>

                <div className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                  <span className="text-indigo-600 font-semibold">API: </span>{item.methods}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>College DSA Capstone Project • Production Grade Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
