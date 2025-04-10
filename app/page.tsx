import { GlowingButton } from "@/components/GlowingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
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
        />
        <GlowingButton>Show Me the Graph</GlowingButton>
      </div>
    </div>
  );
}
