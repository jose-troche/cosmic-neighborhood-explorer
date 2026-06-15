import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars as StarField } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { InstancedMesh } from "three";
import { Color, Object3D } from "three";
import type { DeepSkyObject, Exoplanet, NearEarthObject, Star } from "@cosmic/shared";

type StellarMapProps = {
  deepSkyObjects?: DeepSkyObject[];
  exoplanets?: Exoplanet[];
  nearEarthObjects?: NearEarthObject[];
  stars: Star[];
  visibleLayers?: MapVisibleLayers;
  selectedStarId?: string;
  onSelectObject?: (selection: MapSelection) => void;
  onSelectStar: (star: Star) => void;
};

export type MapSelection =
  | { type: "star"; item: Star }
  | { type: "exoplanet"; item: Exoplanet }
  | { type: "nearEarthObject"; item: NearEarthObject }
  | { type: "deepSkyObject"; item: DeepSkyObject };

export type MapVisibleLayers = {
  stars: boolean;
  exoplanets: boolean;
  nearEarthObjects: boolean;
  deepSkyObjects: boolean;
};

const tempObject = new Object3D();

export function StellarMap({
  deepSkyObjects = [],
  exoplanets = [],
  nearEarthObjects = [],
  stars,
  visibleLayers = { stars: true, exoplanets: true, nearEarthObjects: true, deepSkyObjects: true },
  selectedStarId,
  onSelectObject,
  onSelectStar
}: StellarMapProps) {
  const nearbyNeos = useMemo(() => nearEarthObjects.slice(0, 24), [nearEarthObjects]);

  return (
    <Canvas camera={{ position: [0, 14, 32], fov: 52 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#05070f"]} />
      <ambientLight intensity={0.65} />
      <pointLight position={[0, 0, 0]} intensity={3.2} color="#fff5ce" />
      <StarField radius={90} depth={50} count={1600} factor={4} saturation={0.4} fade speed={0.35} />
      {visibleLayers.stars && <StarInstances stars={stars} onSelectObject={onSelectObject} onSelectStar={onSelectStar} />}
      {visibleLayers.exoplanets && <ExoplanetMarkers exoplanets={exoplanets} stars={stars} onSelectObject={onSelectObject} />}
      {visibleLayers.nearEarthObjects && <NearEarthObjectMarkers objects={nearbyNeos} onSelectObject={onSelectObject} />}
      {visibleLayers.deepSkyObjects && <DeepSkyMarkers objects={deepSkyObjects} onSelectObject={onSelectObject} />}
      <SelectionLabel stars={stars} selectedStarId={selectedStarId} />
      <gridHelper args={[90, 18, "#263552", "#111827"]} position={[0, -8, 0]} />
      <OrbitControls enableDamping dampingFactor={0.08} minDistance={4} maxDistance={120} />
    </Canvas>
  );
}

function ExoplanetMarkers({
  exoplanets,
  stars,
  onSelectObject
}: {
  exoplanets: Exoplanet[];
  stars: Star[];
  onSelectObject?: (selection: MapSelection) => void;
}) {
  const hostPositions = useMemo(() => new Map(stars.map((star) => [star.id, star])), [stars]);
  const planetsByHost = useMemo(() => {
    const grouped = new Map<string, Exoplanet[]>();
    for (const planet of exoplanets) {
      const current = grouped.get(planet.hostStarId) ?? [];
      current.push(planet);
      grouped.set(planet.hostStarId, current);
    }
    return grouped;
  }, [exoplanets]);

  return (
    <>
      {[...planetsByHost].flatMap(([hostId, planets]) => {
        const host = hostPositions.get(hostId);
        if (!host) return [];

        return planets.slice(0, 6).map((planet, index) => {
          const angle = (index / Math.max(planets.length, 1)) * Math.PI * 2;
          const radius = 0.85 + index * 0.22;
          const x = host.xLy + Math.cos(angle) * radius;
          const y = host.zLy + Math.sin(angle * 0.7) * 0.28;
          const z = host.yLy + Math.sin(angle) * radius;
          const color = planet.potentiallyHabitable ? "#6fe2be" : "#7aa7ff";

          return (
            <group
              position={[x, y, z]}
              key={planet.id}
              onClick={(event) => {
                event.stopPropagation();
                onSelectObject?.({ type: "exoplanet", item: planet });
              }}
            >
              <mesh>
                <sphereGeometry args={[planet.potentiallyHabitable ? 0.16 : 0.11, 12, 12]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} roughness={0.4} />
              </mesh>
            </group>
          );
        });
      })}
    </>
  );
}

function NearEarthObjectMarkers({
  objects,
  onSelectObject
}: {
  objects: NearEarthObject[];
  onSelectObject?: (selection: MapSelection) => void;
}) {
  return (
    <>
      {objects.map((object, index) => {
        const angle = index * 2.399963;
        const radius = Math.max(1.2, Math.min(10, object.distanceAu * 62));
        const color = object.potentiallyHazardous ? "#ffb86b" : "#c7d4e8";

        return (
          <group
            position={[Math.cos(angle) * radius, 0.18 + (index % 4) * 0.08, Math.sin(angle) * radius]}
            key={object.id}
            onClick={(event) => {
              event.stopPropagation();
              onSelectObject?.({ type: "nearEarthObject", item: object });
            }}
          >
            <mesh>
              <octahedronGeometry args={[object.potentiallyHazardous ? 0.22 : 0.14, 0]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.8} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function DeepSkyMarkers({
  objects,
  onSelectObject
}: {
  objects: DeepSkyObject[];
  onSelectObject?: (selection: MapSelection) => void;
}) {
  return (
    <>
      {objects.map((object) => {
        const position = scaledDeepSkyPosition(object);
        const scale = object.type === "galaxy" ? 2.4 : object.type === "nebula" ? 1.7 : 1.2;
        return (
          <group
            position={position}
            key={object.id}
            onClick={(event) => {
              event.stopPropagation();
              onSelectObject?.({ type: "deepSkyObject", item: object });
            }}
          >
            <mesh scale={scale}>
              <sphereGeometry args={[0.55, 18, 18]} />
              <meshStandardMaterial color={object.color} emissive={object.color} emissiveIntensity={0.55} transparent opacity={0.72} />
            </mesh>
            <Html position={[0, scale + 0.8, 0]} center className="deep-sky-label">
              <span>{object.name}</span>
            </Html>
          </group>
        );
      })}
    </>
  );
}

function scaledDeepSkyPosition(object: DeepSkyObject): [number, number, number] {
  const magnitude = Math.hypot(object.xLy, object.yLy, object.zLy) || 1;
  const logDistance = Math.min(62, 18 + Math.log10(object.distanceLy) * 11);
  return [
    (object.xLy / magnitude) * logDistance,
    (object.zLy / magnitude) * logDistance,
    (object.yLy / magnitude) * logDistance
  ];
}

function StarInstances({
  stars,
  onSelectObject,
  onSelectStar
}: Pick<StellarMapProps, "stars" | "onSelectObject" | "onSelectStar">) {
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
        if (star) {
          onSelectStar(star);
          onSelectObject?.({ type: "star", item: star });
        }
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
