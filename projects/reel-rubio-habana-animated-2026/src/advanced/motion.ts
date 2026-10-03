import {interpolate, spring} from "remotion";

export type CameraKeyframe = {
  frame: number;
  x: number;
  y: number;
  scale: number;
  rotate?: number;
  tilt?: number;
};

export type CameraState = Required<Omit<CameraKeyframe, "frame">>;

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOutQuint = (t: number) => {
  const p = clamp01(t);
  return p < 0.5 ? 16 * p ** 5 : 1 - ((-2 * p + 2) ** 5) / 2;
};

export const easeOutCubic = (t: number) => 1 - (1 - clamp01(t)) ** 3;

export const windowProgress = (frame: number, start: number, end: number) =>
  clamp01((frame - start) / Math.max(1, end - start));

export const springProgress = (
  frame: number,
  at: number,
  fps = 30,
  config = {damping: 16, stiffness: 130, mass: 0.9},
) =>
  spring({
    frame: Math.max(0, frame - at),
    fps,
    config,
  });

export const followThrough = (
  frame: number,
  at: number,
  amplitude = 1,
  frequency = 0.45,
  damping = 0.08,
) => {
  const t = Math.max(0, frame - at);
  return amplitude * Math.sin(t * frequency) * Math.exp(-t * damping);
};

export const sampleCamera = (
  frame: number,
  keyframes: CameraKeyframe[],
): CameraState => {
  if (keyframes.length === 0) {
    return {x: 0, y: 0, scale: 1, rotate: 0, tilt: 0};
  }

  const first = keyframes[0];
  if (frame <= first.frame) {
    return {
      x: first.x,
      y: first.y,
      scale: first.scale,
      rotate: first.rotate ?? 0,
      tilt: first.tilt ?? 0,
    };
  }

  const last = keyframes[keyframes.length - 1];
  if (frame >= last.frame) {
    return {
      x: last.x,
      y: last.y,
      scale: last.scale,
      rotate: last.rotate ?? 0,
      tilt: last.tilt ?? 0,
    };
  }

  const nextIndex = keyframes.findIndex((key) => key.frame >= frame);
  const a = keyframes[nextIndex - 1];
  const b = keyframes[nextIndex];
  const local = easeInOutQuint(
    interpolate(frame, [a.frame, b.frame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return {
    x: mix(a.x, b.x, local),
    y: mix(a.y, b.y, local),
    scale: mix(a.scale, b.scale, local),
    rotate: mix(a.rotate ?? 0, b.rotate ?? 0, local),
    tilt: mix(a.tilt ?? 0, b.tilt ?? 0, local),
  };
};

export type Point = {x: number; y: number};

export const cubicBezierPoint = (
  tRaw: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point => {
  const t = clamp01(tRaw);
  const mt = 1 - t;
  return {
    x:
      mt ** 3 * p0.x +
      3 * mt ** 2 * t * p1.x +
      3 * mt * t ** 2 * p2.x +
      t ** 3 * p3.x,
    y:
      mt ** 3 * p0.y +
      3 * mt ** 2 * t * p1.y +
      3 * mt * t ** 2 * p2.y +
      t ** 3 * p3.y,
  };
};

export const cubicBezierTangent = (
  tRaw: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point => {
  const t = clamp01(tRaw);
  const mt = 1 - t;
  return {
    x:
      3 * mt ** 2 * (p1.x - p0.x) +
      6 * mt * t * (p2.x - p1.x) +
      3 * t ** 2 * (p3.x - p2.x),
    y:
      3 * mt ** 2 * (p1.y - p0.y) +
      6 * mt * t * (p2.y - p1.y) +
      3 * t ** 2 * (p3.y - p2.y),
  };
};

export const angleFromTangent = (tangent: Point) =>
  (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
