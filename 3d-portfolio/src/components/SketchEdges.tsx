'use client';

import { EffectComposer, Outline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export default function SketchEdges() {
  return (
    <EffectComposer multisampling={0} autoClear={false}>
      <Outline
        blendFunction={BlendFunction.ALPHA}
        edgeStrength={100}
        pulseSpeed={0}
        visibleEdgeColor={0x000000} // Strict Black
        hiddenEdgeColor={0x000000}  // Strict Black
        blur={false}
        width={2}
      />
    </EffectComposer>
  );
}
