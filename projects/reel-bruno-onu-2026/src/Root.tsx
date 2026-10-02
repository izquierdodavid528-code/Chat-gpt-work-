import React from "react";
import {Composition} from "remotion";
import BrunoONUReel, {TOTAL_DURATION_FRAMES} from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BrunoONUReel"
      component={BrunoONUReel}
      durationInFrames={TOTAL_DURATION_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
