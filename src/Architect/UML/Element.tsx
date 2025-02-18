import React, { useCallback, useEffect, useState, useRef } from "react";
import { UseCaseBubbleProps } from "./UseCaseBubble";
import { ClassProps, Class } from "./Class";
import { SystemBoundaryProps } from "./SystemBoundary";

export interface ElementProps {
  id: string;
  className?: string;
  // mode?: Mode;
  // action?: (id: string) => void;
  onDrag?: (id: string) => void;
  onClick?: (id: string) => void;
  onClickClass?: string;
  children?: React.ReactNode;
  constraintArea?: React.RefObject<HTMLElement>;
  style?: React.CSSProperties;
  onPositionChange?: (id: string, x: number, y: number) => void;
  onDimensionChange?: (id: string, width: number, height: number) => void;
  isTemplate?: boolean;
  onMouseDown?: (event: React.MouseEvent) => void;
}

export const Element: React.FC<ElementProps> = ({
  id,
  className = null,
  onClickClass = null,
  // mode = "none",
  // action = null,
  onClick = null,
  onDrag = null,
  children = null,
  constraintArea = null,
  style = null,
  onDimensionChange = null,
  onPositionChange = null,
  onMouseDown = null,
  isTemplate = false,
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleOnClick = () => {
    if (onClick) {
      onClick(id);
    }

    if (onClickClass) {
      setIsSelected((prev) => !prev);
    }
  };

  return (
    <div
      className={`element ${className} ${isTemplate ? "template" : ""} ${
        isSelected && onClickClass ? onClickClass : ""
      }`}
      style={{
        position: isTemplate ? "relative" : "absolute",
        cursor: onDrag ? "grab" : onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={handleOnClick}
      onMouseDown={onMouseDown ?? undefined}
    >
      {children ?? "element"}
    </div>
  );
};

export type AnyNode = UseCaseBubbleProps | ClassProps | SystemBoundaryProps;
