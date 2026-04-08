"use client";

import React, { useState } from 'react';
import { MaglevSimulation, SimState } from './MaglevSimulation';
import { SimulationUI } from './SimulationUI';

export default function SimulationContainer() {
  const [simState, setSimState] = useState<SimState>({
    speed: 60,
    targetSpeed: 60,
    levitationPower: 0.85,
    frequency: 85,
    gapHeight: 18,
    liftForce: 1850,
    rmsCurrent: 154.5,
    chargePower: 82.4,
    tempRise: 32.5,
    isRegen: false,
    currentCamera: 'follow',
    roadSpeed: 0
  });

  const handleUpdate = (update: Partial<SimState>) => {
    setSimState(prev => ({ ...prev, ...update }));
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div className="relative flex-grow min-h-[600px] border-b border-white/10 overflow-hidden">
        <MaglevSimulation state={simState} onUpdate={handleUpdate} />
        <SimulationUI state={simState} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
