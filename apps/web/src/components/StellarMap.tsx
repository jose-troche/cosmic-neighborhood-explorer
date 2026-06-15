import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars as StarField } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { Color } from "three";
import type { DeepSkyObject, Exoplanet, NearEarthObject, Star } from "@cosmic/shared";

type StellarMapProps = {
  deepSkyObjects?: DeepSkyObject[];
  exoplanets?: Exoplanet[];
  nearEarthObjects?: NearEarthObject[];
  stars: Star[];
  starColorMode?: StarColorMode;
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

export type StarColorMode = "temperature" | "distance" | "luminosity" | "motion";

export function StellarMap({
  deepSkyObjects = [],
  exoplanets = [],
  nearEarthObjects = [],
  stars,
  starColorMode = "luminosity",
  visibleLayers = { stars: true, exoplanets: true, nearEarthObjects: true, deepSkyObjects: true },
  selectedStarId,
  onSelectObject,
  onSelectStar
}: StellarMapProps) {
  const nearbyNeos = useMemo(() => nearEarthObjects.slice(0, 24), [nearEarthObjects]);

  return (
    <Canvas camera={{ position: [0, 14, 32], fov: 52 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#05070f"]} />
      <ambientLight intensity={0.38} />
      <pointLight position={[0, 0, 0]} intensity={1.4} color="#fff5ce" />
      <StarField radius={90} depth={50} count={420} factor={1.45} saturation={0} fade speed={0.16} />
      {visibleLayers.stars && (
        <StarMarkers
          stars={stars}
          starColorMode={starColorMode}
          onSelectObject={onSelectObject}
          onSelectStar={onSelectStar}
        />
      )}
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

function StarMarkers({
  stars,
  starColorMode,
  onSelectObject,
  onSelectStar
}: Pick<StellarMapProps, "stars" | "starColorMode" | "onSelectObject" | "onSelectStar">) {
  const colors = useMemo(() => buildStarColors(stars, starColorMode ?? "temperature"), [stars, starColorMode]);

  return (
    <>
      {stars.map((star, index) => (
        <StarMarker
          color={colors[index] ?? new Color(star.color)}
          index={index}
          key={star.id}
          star={star}
          onSelectObject={onSelectObject}
          onSelectStar={onSelectStar}
        />
      ))}
    </>
  );
}

function StarMarker({
  color,
  index,
  star,
  onSelectObject,
  onSelectStar
}: {
  color: Color;
  index: number;
  star: Star;
  onSelectObject?: (selection: MapSelection) => void;
  onSelectStar: (star: Star) => void;
}) {
  const ref = useRef<Group>(null);
  const scale = star.id === "sun" ? 0.62 : Math.max(0.24, Math.min(2.15, Math.cbrt(star.luminositySolar + 0.08) * 1.12));

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const motion = star.properMotionArcsecYr * 0.014;
    ref.current.position.set(star.xLy + Math.sin(clock.elapsedTime * 0.2 + index) * motion, star.zLy, star.yLy);
  });

  return (
    <group
      ref={ref}
      scale={scale}
      position={[star.xLy, star.zLy, star.yLy]}
      onClick={(event) => {
        event.stopPropagation();
        onSelectStar(star);
        onSelectObject?.({ type: "star", item: star });
      }}
    >
      <mesh>
        <sphereGeometry args={[0.58, 20, 20]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh scale={1.9}>
        <sphereGeometry args={[0.58, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} toneMapped={false} />
      </mesh>
    </group>
  );
}

function buildStarColors(stars: Star[], mode: StarColorMode): Color[] {
  const distances = stars.map((star) => star.distanceLy);
  const luminosities = stars.map((star) => Math.log10(star.luminositySolar + 0.001));
  const motions = stars.map((star) => star.properMotionArcsecYr);

  return stars.map((star) => {
    if (star.id === "sun") return new Color("#fff2a8");

    if (mode === "distance") {
      return gradientColor(normalize(star.distanceLy, distances), [
        "#6fe2be",
        "#7aa7ff",
        "#c98cff",
        "#ffb86b"
      ]);
    }

    if (mode === "luminosity") {
      return gradientColor(normalize(Math.log10(star.luminositySolar + 0.001), luminosities), [
        "#4466ff",
        "#73d7ff",
        "#fff4d3",
        "#ffb86b"
      ]);
    }

    if (mode === "motion") {
      return gradientColor(normalize(star.properMotionArcsecYr, motions), [
        "#53657d",
        "#7aa7ff",
        "#6fe2be",
        "#ff6ea8"
      ]);
    }

    return new Color(star.color);
  });
}

function normalize(value: number, values: number[]): number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max <= min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function gradientColor(value: number, stops: string[]): Color {
  const scaled = Math.max(0, Math.min(1, value)) * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(scaled));
  const local = scaled - index;
  return new Color(stops[index]).lerp(new Color(stops[index + 1]), local);
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
