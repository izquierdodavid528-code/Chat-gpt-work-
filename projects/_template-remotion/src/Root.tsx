import React from "react";
import {Composition} from "remotion";
import {TemplateVideo} from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TemplateVideo"
      component={TemplateVideo}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
