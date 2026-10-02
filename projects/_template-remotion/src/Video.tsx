import React from "react";
import {AbsoluteFill} from "remotion";

export const TemplateVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0b0b",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        fontSize: 72,
        fontWeight: 700,
      }}
    >
      Nuevo proyecto Remotion
    </AbsoluteFill>
  );
};
