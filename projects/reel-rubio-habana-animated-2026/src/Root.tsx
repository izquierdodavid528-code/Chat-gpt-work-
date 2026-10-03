import React from "react";
import {Composition} from "remotion";
import {RubioHabanaAnimated, TOTAL_FRAMES} from "./Video";
import {AdvancedOpeningPilot, PILOT_FRAMES} from "./advanced/OpeningPilot";
import {CartoonExplainerV6, CARTOON_FILM_FRAMES} from "./advanced/CartoonExplainerV5";

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
      id="CartoonExplainerV6"
      component={CartoonExplainerV6}
      durationInFrames={CARTOON_FILM_FRAMES}
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
