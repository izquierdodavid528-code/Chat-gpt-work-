import React from "react";
import {Composition} from "remotion";
import {RubioHabanaAnimated, TOTAL_FRAMES} from "./Video";
import {RubioSixtySecondAnimatic, RUBIO_ANIMATIC_FRAMES} from "./VoiceAnimatic";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="RubioHabanaAnimated"
      component={RubioHabanaAnimated}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="RubioSixtySecondAnimatic"
      component={RubioSixtySecondAnimatic}
      durationInFrames={RUBIO_ANIMATIC_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
