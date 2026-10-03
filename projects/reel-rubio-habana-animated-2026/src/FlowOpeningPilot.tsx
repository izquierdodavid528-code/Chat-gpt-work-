import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {wipe} from "@remotion/transitions/wipe";

export const FLOW_OPENING_PILOT_FRAMES = 279;

type ShotProps = {
  src: string;
  startFrom: number;
  duration: number;
  zoomFrom: number;
  zoomTo: number;
};

const Shot: React.FC<ShotProps> = ({src, startFrom, duration, zoomFrom, zoomTo}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, duration], [zoomFrom, zoomTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#F3E9D2"}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrom}
        volume={0}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(" + zoom + ")",
          filter: "saturate(1.03) contrast(1.02)",
        }}
      />
    </AbsoluteFill>
  );
};

const Finish: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: "none"}}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at center, transparent 58%, rgba(25, 28, 27, 0.16) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.10,
        mixBlendMode: "multiply",
        backgroundImage:
          "radial-gradient(rgba(32,39,42,.22) .55px, transparent .8px)",
        backgroundSize: "11px 11px",
      }}
    />
  </AbsoluteFill>
);

export const FlowOpeningPilot: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#F3E9D2", overflow: "hidden"}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={42}>
        <Shot
          src="flow/video/habana-harbor-ships-v1.mp4"
          startFrom={0}
          duration={42}
          zoomFrom={1.01}
          zoomTo={1.06}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({direction: "from-right"})}
        timing={linearTiming({durationInFrames: 9})}
      />
      <TransitionSeries.Sequence durationInFrames={84}>
        <Shot
          src="flow/video/rubio-document-acting-v1.mp4"
          startFrom={30}
          duration={84}
          zoomFrom={1.02}
          zoomTo={1.045}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({direction: "from-bottom"})}
        timing={linearTiming({durationInFrames: 9})}
      />
      <TransitionSeries.Sequence durationInFrames={78}>
        <Shot
          src="flow/video/rubio-document-harbor-animation-v1.mp4"
          startFrom={24}
          duration={78}
          zoomFrom={1.035}
          zoomTo={1.07}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({direction: "from-right"})}
        timing={linearTiming({durationInFrames: 9})}
      />
      <TransitionSeries.Sequence durationInFrames={102}>
        <Shot
          src="flow/video/rubio-paper-to-harbor-gate-v1.mp4"
          startFrom={60}
          duration={102}
          zoomFrom={1.02}
          zoomTo={1.055}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Finish />
  </AbsoluteFill>
);
