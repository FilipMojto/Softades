import React from "react";
import { Node, NodeProps, NodeType } from "./Node";

export const DEF_WIDTH = 100;
export const DEF_HEIGHT = 100;
export const DEF_X = 0;
export const DEF_Y = 0;

export interface ClassProps extends NodeProps {
  type?: NodeType;
}

export const Class: React.FC<ClassProps> = ({
  type = "Class",
  id,
  x = DEF_X,
  y = DEF_Y,
  width = DEF_WIDTH,
  height = DEF_HEIGHT,
  onClick = null,
  onDrag = null,
  onPositionChange,
  onDimensionChange,
  constraintArea: parentRef = null,
}) => {
  return (
    <Node
      type={type}
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      onClick={onClick ?? undefined}
      onDrag={onDrag ?? undefined}
      onDimensionChange={onDimensionChange}
      onPositionChange={onPositionChange}
      constraintArea={parentRef ?? undefined}
    >
      hsdh
    </Node>
  );
};
