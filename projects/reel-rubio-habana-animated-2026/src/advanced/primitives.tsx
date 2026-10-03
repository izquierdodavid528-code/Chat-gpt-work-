import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {
  CameraKeyframe,
  CameraState,
  followThrough,
  sampleCamera,
  springProgress,
} from "./motion";

export const SceneCamera: React.FC<{
  track: CameraKeyframe[];
  children: (camera: CameraState) => React.ReactNode;
}> = ({track, children}) => {
  const frame = useCurrentFrame();
  const camera = sampleCamera(frame, track);
  return <>{children(camera)}</>;
};

export const DepthLayer: React.FC<{
  camera: CameraState;
  depth: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({camera, depth, children, style}) => {
  const depthScale = 1 + (camera.scale - 1) * depth;
  const x = camera.x * depth;
  const y = camera.y * depth;
  const rotate = camera.rotate * depth;
  const tilt = camera.tilt * depth;

  return (
    <AbsoluteFill
      style={{
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        transform: `perspective(1500px) translate3d(${x}px, ${y}px, ${depth * 45}px) scale(${depthScale}) rotateZ(${rotate}deg) rotateX(${tilt}deg)`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const PhysicalTransition: React.FC<{
  at: number;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  fromRotation?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  at,
  fromX = 0,
  fromY = 80,
  fromScale = 0.78,
  fromRotation = -8,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = springProgress(frame, at, 30, {
    damping: 14,
    stiffness: 155,
    mass: 0.85,
  });
  const tail = followThrough(frame, at + 8, 5, 0.55, 0.11);

  return (
    <div
      style={{
        opacity: p,
        transformOrigin: "50% 50%",
        transform: `translate3d(${fromX * (1 - p)}px, ${fromY * (1 - p) + tail}px, 0) scale(${fromScale + (1 - fromScale) * p}) rotate(${fromRotation * (1 - p) + tail * 0.18}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const ImpactAction: React.FC<{
  at: number;
  x: number;
  y: number;
  radius?: number;
}> = ({at, x, y, radius = 170}) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, (frame - at) / 20));
  if (p <= 0 || p >= 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        border: `${Math.max(2, 12 * (1 - p))}px solid rgba(217,91,82,${0.48 * (1 - p)})`,
        transform: `scale(${0.35 + p * 1.25})`,
        pointerEvents: "none",
      }}
    />
  );
};

const hash = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

export const ParticleField: React.FC<{
  count?: number;
  frame: number;
  originX: number;
  originY: number;
  spreadX?: number;
  spreadY?: number;
  opacity?: number;
}> = ({
  count = 24,
  frame,
  originX,
  originY,
  spreadX = 360,
  spreadY = 160,
  opacity = 0.35,
}) => (
  <>
    {Array.from({length: count}).map((_, i) => {
      const seed = i + 1;
      const phase = hash(seed * 3.7) * Math.PI * 2;
      const drift = ((frame + seed * 17) % 120) / 120;
      const x =
        originX +
        (hash(seed * 11.3) - 0.5) * spreadX -
        drift * (90 + hash(seed * 8.1) * 120);
      const y =
        originY +
        (hash(seed * 19.1) - 0.5) * spreadY +
        Math.sin(frame / 14 + phase) * 10;
      const size = 3 + hash(seed * 23.9) * 8;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size * 0.45,
            borderRadius: "999px",
            background: `rgba(255,246,230,${opacity * (0.45 + hash(seed * 5.2) * 0.55)})`,
            transform: `rotate(${-12 + hash(seed * 2.1) * 24}deg)`,
          }}
        />
      );
    })}
  </>
);
