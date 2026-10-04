import React from "react";
import {Composition} from "remotion";
import {RubioHabanaAnimated, TOTAL_FRAMES} from "./Video";
import {RubioSixtySecondAnimatic, RUBIO_ANIMATIC_FRAMES} from "./VoiceAnimatic";

import {RubioGenerativeS06S08Pilot, GENERATIVE_PILOT_FRAMES} from "./GenerativePilot";

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
    <Composition
      id="RubioGenerativeS06S08Pilot"
      component={RubioGenerativeS06S08Pilot}
      durationInFrames={GENERATIVE_PILOT_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
