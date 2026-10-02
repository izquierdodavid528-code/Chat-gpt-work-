import React from "react";
import {Composition} from "remotion";
import BrunoONUReel, {TOTAL_DURATION_FRAMES} from "./Video";
import BrunoONUReelV3, {V3_DURATION_FRAMES, V3_FPS} from "./VideoV3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BrunoONUReel"
        component={BrunoONUReel}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BrunoONUReelV3"
        component={BrunoONUReelV3}
        durationInFrames={V3_DURATION_FRAMES}
        fps={V3_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
