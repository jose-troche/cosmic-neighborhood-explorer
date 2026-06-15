import { Gauge } from "lucide-react";
import { SPEED_PRESETS, type TravelTarget } from "@cosmic/shared";

type Props = {
  duration: string;
  speedId: string;
  targetId: string;
  targets: TravelTarget[];
  onSpeedChange: (speedId: string) => void;
  onTargetChange: (targetId: string) => void;
};

export function TravelExplorer({ duration, speedId, targetId, targets, onSpeedChange, onTargetChange }: Props) {
  const selectedTarget = targets.find((target) => target.id === targetId) ?? targets[0]!;
  const selectedSpeed = SPEED_PRESETS.find((speed) => speed.id === speedId) ?? SPEED_PRESETS[0]!;

  return (
    <div className="travel-layout">
      <label className="field">
        <span>Destination</span>
        <select value={targetId} onChange={(event) => onTargetChange(event.target.value)}>
          {targets.map((target) => (
            <option value={target.id} key={target.id}>
              {target.name}
            </option>
          ))}
        </select>
      </label>

      <div className="speed-grid" aria-label="Speed presets">
        {SPEED_PRESETS.map((speed) => (
          <button className={speed.id === speedId ? "speed-button active" : "speed-button"} key={speed.id} onClick={() => onSpeedChange(speed.id)} type="button">
            <Gauge size={15} />
            <span>{speed.label}</span>
          </button>
        ))}
      </div>

      <div className="travel-result">
        <span>{selectedTarget.distanceLy.toFixed(2)} light-years at {selectedSpeed.kmS.toLocaleString("en-US")} km/s</span>
        <strong>{duration}</strong>
      </div>
    </div>
  );
}
