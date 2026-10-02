import React from "react";
import {Composition} from "remotion";
import BrunoONUReel from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BrunoONUReel"
      component={BrunoONUReel}
      durationInFrames={2016}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
