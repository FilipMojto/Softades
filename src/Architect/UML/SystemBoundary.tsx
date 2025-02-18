import React, { useRef } from "react";
import { Node, NodeProps, NodeType } from "./Node";
import { v4 as uuidv4 } from "uuid";

export const DEF_WIDTH = 200;
export const DEF_HEIGHT = 200;
export const DEF_X = 0;
export const DEF_Y = 0;

export interface SystemBoundaryProps extends NodeProps {
  type?: NodeType;
  systemName: string;
  title?: string;
}

export const SystemBoundary: React.FC<SystemBoundaryProps> = ({
  id,
  title = 'Title...',
  x = DEF_X,
  y = DEF_Y,
  width = DEF_WIDTH,
  height = DEF_HEIGHT,
  isTemplate = false,
  onDrag,
  onDimensionChange,
  onPositionChange,
  onClick,
  systemName,
  children,
  constraintArea,
  resizable
}) => {
  return (
    <Node
      className="system-boundary"
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      isTemplate={isTemplate}
      onDrag={onDrag}
      onDimensionChange={onDimensionChange}
      onPositionChange={onPositionChange}
      constraintArea={constraintArea}
      resizable={resizable}
      style={
        {
          // backgroundColor: "transparent",
          // backgroundColor: "#e6f3ff", /* Light blue background */
          // border: "1px outset #007acc85", /* Blue border */
        }
      }
      onClick={onClick}
    >
      <input placeholder={title} autoComplete="off" name="random-field-123"></input>
    </Node>
  );
};
