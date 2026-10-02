import React from "react";
import {Composition} from "remotion";
import {WowWorkspaceDemo} from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WowWorkspaceDemo"
      component={WowWorkspaceDemo}
      durationInFrames={372}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
