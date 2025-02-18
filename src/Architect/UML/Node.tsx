import React, { useEffect, useRef, useState } from "react";
import { Class, ClassProps } from "./Class";
import { AnyNode, Element, ElementProps } from "./Element";
import { UseCaseBubble, UseCaseBubbleProps } from "./UseCaseBubble";
import { v4 as uuidv4 } from "uuid";
import { SystemBoundary, SystemBoundaryProps } from "./SystemBoundary";

export const DEF_WIDTH = 100;
export const DEF_HEIGHT = 100;
export const DEF_X = 0;
export const DEF_Y = 0;

export type NodeType = "UseCaseBubble" | "Class" | "SystemBoundary";

// export interface NodeRendererProps{
// 	props: AnyNode
// }

export const NodeRenderer = (props: AnyNode) => {
  switch (props.type) {
    case "Class":
      return <Class {...props} />;
    case "UseCaseBubble":
      return <UseCaseBubble {...props} />;
    case "SystemBoundary":
      return <SystemBoundary {...props as SystemBoundaryProps} />;
    default:
      return null;
  }
};

export interface NodeProps extends ElementProps {
  // id: string;
  // className?: string;
  type?: NodeType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // mode?: Mode;
  // action?: () => void;
  // children?: React.ReactNode;
  constraintArea?: React.RefObject<HTMLElement>;
  // as?: keyof React.JSX.IntrinsicElements;
  // style?: React.CSSProperties;
  onPositionChange?: (id: string, x: number, y: number) => void;
  onDimensionChange?: (id: string, width: number, height: number) => void;
  resizable?: boolean
  // isTemplate?: boolean;
}

// Internal type (required properties)
// export interface NodeInternalProps extends Omit<NodeProps, "x" | "y" | "width" | "height"> {
//   x: number; // Required in internal type
//   y: number; // Required in internal type
//   width: number; // Required in internal type
//   height: number; // Required in internal type
// }



export const Node: React.FC<NodeProps> = ({
  // type = "Element",
  // as = "div",
  type,
  style,
  children,
  id,
  // id = useRef<string>(uuidv4()),
  className = "",
  x = DEF_X,
  y = DEF_Y,
  width = DEF_WIDTH,
  height = DEF_HEIGHT,
  onClick = null,
  onDrag = null,
  //   mode = "none",
  //   action = null,
  constraintArea: parentRef = null,
  onPositionChange,
  onDimensionChange,
  isTemplate = false,
  resizable = false
}) => {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent) => {
    // onDimensionChange ? onDimensionChange(id, width + 5, height + 5) : (undefined);
    
    if (!onDrag) return;
    // Detect if the click is within the resizable border area (e.g., bottom-right corner)
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    // Define resize margins (adjust as needed)
    const resizeMargin = 10;

    const isResizing =
      resizable &&
      (event.clientX >= rect.right - resizeMargin || event.clientY >= rect.bottom - resizeMargin);
    console.log(isResizing);
    if (isResizing) return; // Suppress dragging if resizing

    // Ensure dragging starts only when clicking directly on the component itself
    if (event.target !== event.currentTarget) return;

    setIsDragging(true);
    setOffset({ x: event.clientX - position.x, y: event.clientY - position.y });
    // console.log(isResizing);

  };

  const handleMouseMove = (event: MouseEvent) => {
 
    if (!isDragging || !onDrag) return;

    let newX = event.clientX - offset.x;
    let newY = event.clientY - offset.y;

    if (parentRef?.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      newX = Math.max(0, Math.min(newX, parentRect.width - width));
      newY = Math.max(0, Math.min(newY, parentRect.height - height));
    }

    setPosition({ x: newX, y: newY });
    onPositionChange?.(id, newX, newY);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (!onDrag) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset, onDrag]);


  return (
    <Element
      id={id}
      className={className}
      style={{
        left: position.x,
        top: position.y,
        width: width,
        minHeight: height,
        cursor: onDrag
          ? isDragging
            ? "grabbing"
            : "grab"
          : onClick
          ? "pointer"
          : "default",
        ...style,
        resize: resizable ? "both" : "none",
        overflow: resizable ? "auto" : "hidden",
      }}
      onClick={onClick ?? undefined}
      onDrag={onDrag ?? undefined}
      isTemplate={isTemplate}
      onMouseDown={handleMouseDown}
    >
      {children}
    </Element>

  );
};
