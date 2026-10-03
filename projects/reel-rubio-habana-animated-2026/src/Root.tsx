import React from "react";
import {Composition} from "remotion";
import {RubioHabanaAnimated, TOTAL_FRAMES} from "./Video";
import {FlowOpeningPilot, FLOW_OPENING_PILOT_FRAMES} from "./FlowOpeningPilot";

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
    id="RubioFlowOpeningPilot"
    component={FlowOpeningPilot}
    durationInFrames={FLOW_OPENING_PILOT_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
  </>
);
