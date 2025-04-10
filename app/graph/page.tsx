"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

export default function GraphPage() {
  const [repo, setRepo] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGraph = async () => {
    if (!repo) return;

    setLoading(true);
    setError(null);
    setGraphData(null);

    try {
      const res = await fetch(`/api/parse?repo=${repo}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to load graph");

      setGraphData(json);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Github Import Graph</h1>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. vercel/next.js"
          className="border p-2 rounded w-72"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
        <button
          onClick={fetchGraph}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {graphData && (
        <div className="h-[600px] border rounded shadow">
          <ForceGraph3D
            graphData={graphData}
            nodeLabel="id"
            nodeAutoColorBy="group"
            linkDirectionalParticles={2}
            linkDirectionalArrowLength={3}
          />
        </div>
      )}
    </div>
  );
}
