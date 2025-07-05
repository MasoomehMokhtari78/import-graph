"use client";
import { useState, useRef } from "react";
import { GlowingButton } from "@/components/GlowingButton";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import SpriteText from "three-spritetext";
import { ForceGraphMethods } from "react-force-graph-3d";
import SpinnerIcon from "@/components/ui/SpinnerIcon";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

type NodeType = { id: string };
type LinkType = { source: NodeType; target: NodeType };
type GraphData = {
  nodes: NodeType[];
  links: LinkType[];
};

export default function Home() {
  const [repo, setRepo] = useState("");
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedNode, setSelectedNode] = useState<
    string | number | undefined
  >();
  const [connectedNodeIds, setConnectedNodeIds] = useState<Set<string>>(
    new Set()
  );

  const graphRef = useRef<ForceGraphMethods<NodeType, LinkType>>(null);

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
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full h-full min-h-screen">
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h1 className="relative z-10 text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          Import Graph
        </h1>
        <p className="text-gray-400">
          You can enter your github repo to see an interactive graph of your
          project&apos;s imports!
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full items-center">
        <Input
          placeholder="e.g. Masoomehmokhtari78/Porfolio"
          className="w-[60%] h-[56px] text-white"
          name="repo"
          onChange={(e) => setRepo(e.target.value)}
          disabled={loading}
        />
        <GlowingButton onSubmit={fetchGraph} loading={loading}>
          Show Me the Graph
        </GlowingButton>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {loading && (
        <div className="w-[600px] h-[600px] flex gap-2 items-center justify-center border border-gray-700 rounded-xl animate-pulse bg-gray-900">
          <p className="text-gray-500">Loading graph</p>
          <SpinnerIcon className="text-gray-500" />
        </div>
      )}

      {graphData && (
        <>
          <div className="flex gap-6 items-center">
            <button
              onClick={() => {
                //@ts-expect-error
                const newZoom = graphRef.current?.cameraPosition().z * 0.8;
                graphRef.current?.cameraPosition(
                  { x: 0, y: 0, z: newZoom },
                  undefined,
                  500
                );
              }}
              className="bg-gray-900 px-4 py-2 h-fit rounded-sm shadow-[0_2px_15px_rgba(255,_255,_255,_0.5)] transition-shadow duration-500 hover:shadow-[0_2px_20px_rgba(255,_255,_255,_0.5)]"
            >
              +
            </button>

            <button
              onClick={() => {
                //@ts-expect-error
                const newZoom = graphRef.current?.cameraPosition().z * 1.2;
                graphRef.current?.cameraPosition(
                  { x: 0, y: 0, z: newZoom },
                  undefined,
                  500
                );
              }}
              className="text-2xl bg-gray-900 px-4 py-1 h-fit rounded-sm shadow-[0_2px_15px_rgba(255,_255,_255,_0.5)] transition-shadow duration-500 hover:shadow-[0_2px_20px_rgba(255,_255,_255,_0.5)]"
            >
              -
            </button>

            <button
              onClick={() => {
                graphRef.current?.zoomToFit();
              }}
              className="bg-gray-900 px-4 py-2 rounded-sm shadow-[0_2px_15px_rgba(255,_255,_255,_0.5)] transition-shadow duration-500 hover:shadow-[0_2px_20px_rgba(255,_255,_255,_0.5)]"
            >
              Reset Camera
            </button>
          </div>

          <div className="relative w-[1000px] h-[600px] flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 rounded-xl pointer-events-none" />

            <ForceGraph3D
              //@ts-expect-error
              ref={graphRef}
              graphData={graphData}
              nodeLabel="id"
              nodeAutoColorBy="group"
              linkDirectionalParticles={2}
              linkDirectionalArrowLength={3}
              width={600}
              height={600}
              backgroundColor="rgba(0,0,0,0)"
              onNodeClick={(node) => {
                const selectedId = node.id;
                setSelectedNode(selectedId);

                const connectedIds = new Set<string>();
                graphData.links.forEach((link) => {
                  const sourceId =
                    typeof link.source === "object"
                      ? link.source.id
                      : link.source;
                  const targetId =
                    typeof link.target === "object"
                      ? link.target.id
                      : link.target;

                  if (sourceId === selectedId) connectedIds.add(targetId);
                  else if (targetId === selectedId) connectedIds.add(sourceId);
                });

                setConnectedNodeIds(connectedIds);
              }}
              //@ts-expect-error
              nodeThreeObject={(node: NodeType) => {
                const sprite = new SpriteText(node.id);
                sprite.textHeight = 8;

                const isSelected = selectedNode === node.id;
                const isConnected = connectedNodeIds.has(node.id);

                if (!selectedNode) {
                  sprite.color = "#c1c1c1";
                  sprite.material.opacity = 1;
                } else if (isSelected) {
                  sprite.color = "#1893e4";
                  sprite.material.opacity = 1;
                } else if (isConnected) {
                  sprite.color = "#45aaf2";
                  sprite.material.opacity = 1;
                } else {
                  sprite.color = "#c1c1c1";
                  sprite.material.opacity = 0.2;
                }

                sprite.material.transparent = true;
                return sprite;
              }}
              linkColor={(link) => {
                if (!selectedNode) return "rgba(193, 193, 193, 1)";

                const sourceId =
                  typeof link.source === "object"
                    ? link.source.id
                    : link.source;
                const targetId =
                  typeof link.target === "object"
                    ? link.target.id
                    : link.target;

                const isConnected =
                  sourceId === selectedNode || targetId === selectedNode;

                return isConnected
                  ? "rgba(24, 147, 228, 1)"
                  : "rgba(193, 193, 193, 0.2)";
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
