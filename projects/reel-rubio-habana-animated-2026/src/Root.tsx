import React from "react";
import {Composition} from "remotion";
import {RubioHabanaAnimated, TOTAL_FRAMES} from "./Video";
import {AdvancedOpeningPilot, PILOT_FRAMES} from "./advanced/OpeningPilot";

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
      id="AdvancedOpeningPilot"
      component={AdvancedOpeningPilot}
      durationInFrames={PILOT_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
