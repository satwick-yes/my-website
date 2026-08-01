import Scene from '@/components/Scene';
import Overlay from '@/components/Overlay';

export default function Home() {
  return (
    <main className="relative w-full h-full bg-white text-black overflow-hidden selection:bg-black selection:text-white">
      <Scene />
      <Overlay />
    </main>
  );
}
