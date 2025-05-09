"use client";
import { useState, useEffect, useRef } from "react";
import { GlowingButton } from "@/components/GlowingButton";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import SpriteText from "three-spritetext";
import { ForceGraphMethods } from "react-force-graph-3d";
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

type NodeType = { id: string };

export default function Home() {
  const [repo, setRepo] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const graphRef = useRef<ForceGraphMethods | null>(null);

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

  useEffect(() => {
    if (!graphRef.current) return;

    graphRef.current.cameraPosition({ x: 0, y: 0, z: 50 }, undefined, 3000);
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full h-full min-h-screen">
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h1 className="relative z-10 text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Import Graph
        </h1>
        <p className="text-gray-400">
          You can enter your github repo to see an interactive graph of your
          project's imports!
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full items-center">
        <Input
          placeholder="e.g. Masoomehmokhtari78/Porfolio"
          className="w-[60%] h-[56px] text-white"
          name="repo"
          onChange={(e) => setRepo(e.target.value)}
        />
        <GlowingButton onSubmit={fetchGraph}>Show Me the Graph</GlowingButton>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {graphData && (
        <div>
          <ForceGraph3D
            graphData={graphData}
            nodeLabel="id"
            nodeAutoColorBy="group"
            linkDirectionalParticles={2}
            linkDirectionalArrowLength={3}
            width={600}
            height={600}
            backgroundColor="rgba(0,0,0,0)"
            ref={graphRef}
            nodeThreeObject={(node: NodeType) => {
              const sprite = new SpriteText(node.id);
              sprite.color = "#c1c1c1";
              sprite.textHeight = 8;
              return sprite;
            }}
          />
        </div>
      )}
    </div>
  );
}
