import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars as StarField } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { InstancedMesh } from "three";
import { Color, Object3D } from "three";
import type { Star } from "@cosmic/shared";

type StellarMapProps = {
  stars: Star[];
  selectedStarId?: string;
  onSelectStar: (star: Star) => void;
};

const tempObject = new Object3D();

export function StellarMap({ stars, selectedStarId, onSelectStar }: StellarMapProps) {
  return (
    <Canvas camera={{ position: [0, 14, 32], fov: 52 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#05070f"]} />
      <ambientLight intensity={0.65} />
      <pointLight position={[0, 0, 0]} intensity={3.2} color="#fff5ce" />
      <StarField radius={90} depth={50} count={1600} factor={4} saturation={0.4} fade speed={0.35} />
      <StarInstances stars={stars} onSelectStar={onSelectStar} />
      <SelectionLabel stars={stars} selectedStarId={selectedStarId} />
      <gridHelper args={[90, 18, "#263552", "#111827"]} position={[0, -8, 0]} />
      <OrbitControls enableDamping dampingFactor={0.08} minDistance={4} maxDistance={120} />
    </Canvas>
  );
}

function StarInstances({ stars, onSelectStar }: Pick<StellarMapProps, "stars" | "onSelectStar">) {
  const ref = useRef<InstancedMesh>(null);
  const colors = useMemo(() => stars.map((star) => new Color(star.color)), [stars]);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const elapsed = clock.elapsedTime;
    stars.forEach((star, index) => {
      const motion = star.properMotionArcsecYr * 0.014;
      const scale = Math.max(0.16, Math.min(1.55, Math.cbrt(star.luminositySolar + 0.04)));
      tempObject.position.set(star.xLy + Math.sin(elapsed * 0.2 + index) * motion, star.zLy, star.yLy);
      tempObject.scale.setScalar(star.id === "sun" ? 0.42 : scale);
      tempObject.updateMatrix();
      ref.current!.setMatrixAt(index, tempObject.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, stars.length]}
      onClick={(event) => {
        event.stopPropagation();
        const star = typeof event.instanceId === "number" ? stars[event.instanceId] : undefined;
        if (star) onSelectStar(star);
      }}
    >
      <sphereGeometry args={[0.55, 24, 24]}>
        <instancedBufferAttribute attach="attributes-color" args={[new Float32Array(colors.flatMap((color) => [color.r, color.g, color.b])), 3]} />
      </sphereGeometry>
      <meshStandardMaterial vertexColors emissive="#ffffff" emissiveIntensity={0.55} roughness={0.45} />
    </instancedMesh>
  );
}

function SelectionLabel({ stars, selectedStarId }: { stars: Star[]; selectedStarId?: string }) {
  const star = stars.find((item) => item.id === selectedStarId);
  if (!star) return null;

  return (
    <Html position={[star.xLy, star.zLy + 1.3, star.yLy]} center className="star-label">
      <span>{star.name}</span>
    </Html>
  );
}
