import { OrbitingCircles } from "@/components/ui/orbiting-circles";

export default function OrbitingCircleIcons() {
  return (
    <div className="absolute h-[240px] w-full overflow-hidden opacity-100 hover:opacity-50">
      <OrbitingCircles radius={200} speed={1.7}>
        <span className="text-6xl">🖥️</span>
        <span className="text-6xl">📱</span>
      </OrbitingCircles>
      <OrbitingCircles radius={140} reverse speed={1.5}>
        <span className="text-6xl">💻</span>
        <span className="text-6xl">💻</span>
      </OrbitingCircles>
      <OrbitingCircles radius={80} speed={1.1}>
        <span className="text-6xl">📱</span>
      </OrbitingCircles>
    </div>
  );
}
