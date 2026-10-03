import React from "react";
import {Composition} from "remotion";
import {RubioHabanaAnimatic, ANIMATIC_FRAMES} from "./Video";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="RubioHabanaAnimatic"
    component={RubioHabanaAnimatic}
    durationInFrames={ANIMATIC_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
