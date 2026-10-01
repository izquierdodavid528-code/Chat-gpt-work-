import React from "react";
import {Composition} from "remotion";
import VideoWithSpanishSubtitles from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SpanishSubtitles"
      component={VideoWithSpanishSubtitles}
      durationInFrames={7660}
      fps={60}
      width={640}
      height={360}
    />
  );
};
