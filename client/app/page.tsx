import { Globe } from "@/components/magicui/globe";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { RetroGrid } from "@/components/magicui/retro-grid";

export default function Home() {
  return (
    <div className=" h-full w-full overflow-hidden">
      <RetroGrid />
      <TypingAnimation className={"text-5xl mb-2 font-bold text-center"}>
        Landing Page
      </TypingAnimation>
      <Globe className={"mt-36"} />
    </div>
  );
}
