import React, { useCallback, useEffect, useState, useRef } from "react";
import { UseCaseBubbleProps } from "./UseCaseBubble";
import { ClassProps, Class } from "./Class";
  import { v4 as uuidv4 } from "uuid";
import { SystemBoundaryProps } from "./SystemBoundary";

// export const DEF_WIDTH = 100;
// export const DEF_HEIGHT = 100;
// export const DEF_X = 0;
// export const DEF_Y = 0;

// type Mode = "none" | "clickable" | "draggable";

export interface ElementProps {
  id: string;
  className?: string;
  // mode?: Mode;
  // action?: (id: string) => void;
  onDrag?: (id: string) => void;
  onClick?: (id: string) => void;
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
  // const [position, setPosition] = useState({ x, y });
  // const [isDragging, setIsDragging] = useState(false);
  // const [offset, setOffset] = useState({ x: 0, y: 0 });

  // const handleMouseDown = (event: React.MouseEvent) => {
  //   // onDimensionChange ? onDimensionChange(id, width + 5, height + 5) : (undefined);

  //   if (mode !== "draggable") return;

  //   // Ensure dragging starts only when clicking directly on the component itself
  //   if (event.target !== event.currentTarget) return;

  //   setIsDragging(true);
  //   // setOffset({ x: event.clientX - position.x, y: event.clientY - position.y });
  // };

  // const handleMouseMove = (event: MouseEvent) => {
  //   if (!isDragging || mode !== "draggable") return;

  //   let newX = event.clientX - offset.x;
  //   let newY = event.clientY - offset.y;

  //   if (parentRef?.current) {
  //     const parentRect = parentRef.current.getBoundingClientRect();
  //     newX = Math.max(0, Math.min(newX, parentRect.width - width));
  //     newY = Math.max(0, Math.min(newY, parentRect.height - height));
  //   }

  //   // setPosition({ x: newX, y: newY });
  //   onPositionChange?.(id, newX, newY);
  // };

  // const handleMouseUp = () => setIsDragging(false);

  // useEffect(() => {
  //   if (mode !== "draggable") return;
  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp);
  //   return () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [isDragging, offset, mode]);

  // const Component = as;

  return (
    <div
      className={`element ${className} ${isTemplate ? "template" : ""}`}
      style={{
        position: isTemplate ? "relative" : "absolute",
        // left: position.x,
        // top: position.y,
        // width: width,
        // minHeight: height,
        cursor: onDrag
          ? // ? isDragging
            //   ? "grabbing"
            "grab"
          : onClick
          ? "pointer"
          : "default",
        // backgroundColor: "lightgray",
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        // userSelect: "none",
        // boxSizing: "border-box",
        ...style,
      }}
      // onMouseDown={handleMouseDown}
      onClick={onClick ? () => onClick(id) : undefined}
      onMouseDown={onMouseDown ?? undefined}
    >
      {children ?? "element"}
    </div>
  );
};

// export interface ElementProps {
//   id: string;
//   className?: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   mode?: Mode;
//   action?: () => void;
//   children?: React.ReactNode;
//   constraintArea?: React.RefObject<HTMLElement>;
//   // as?: keyof React.JSX.IntrinsicElements;
//   style?: React.CSSProperties;
//   onPositionChange?: (id: string, x: number, y: number) => void;
//   onDimensionChange?: (id: string, width: number, height: number) => void;
//   isTemplate?: boolean;
// }

export type AnyNode = UseCaseBubbleProps | ClassProps | SystemBoundaryProps;

// type ElementTypeMap = {
//   Class: ClassProps;
//   UseCaseBubble: UseCaseBubbleProps;
// };

// export type AnyElement<T extends keyof ElementTypeMap = keyof ElementTypeMap> =
//   ElementTypeMap[T] & { type: T };

// export const createElement = <T extends keyof ElementTypeMap>(
//   id: string,
//   type: T,
//   x: number,
//   y: number,
//   constraintArea?: React.RefObject<HTMLDivElement>,
//   width?: number,
//   height?: number,
//   mode: Mode = "none",

//   isTemplate: boolean = false
// ): AnyElement<T> => ({
//   id,
//   x,
//   y,
//   mode: mode,
//   constraintArea,
//   width: width ?? DEF_WIDTH,
//   height: height ?? DEF_HEIGHT,
//   type, // Now explicitly included
//   isTemplate: isTemplate,
// });

// export const Element: React.FC<ElementProps> = ({
//   // type = "Element",
//   // as = "div",
//   style,
//   children,
//   id,
//   className = "",
//   x = DEF_X,
//   y = DEF_Y,
//   width = DEF_WIDTH,
//   height = DEF_HEIGHT,
//   mode = "none",
//   action = null,
//   constraintArea: parentRef = null,
//   onPositionChange,
//   onDimensionChange,
//   isTemplate = false,
// }) => {
//   const [position, setPosition] = useState({ x, y });
//   const [isDragging, setIsDragging] = useState(false);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });

//   const handleMouseDown = (event: React.MouseEvent) => {
//     // onDimensionChange ? onDimensionChange(id, width + 5, height + 5) : (undefined);

//     if (mode !== "draggable") return;

//     // Ensure dragging starts only when clicking directly on the component itself
//     if (event.target !== event.currentTarget) return;

//     setIsDragging(true);
//     setOffset({ x: event.clientX - position.x, y: event.clientY - position.y });
//   };

//   const handleMouseMove = (event: MouseEvent) => {
//     if (!isDragging || mode !== "draggable") return;

//     let newX = event.clientX - offset.x;
//     let newY = event.clientY - offset.y;

//     if (parentRef?.current) {
//       const parentRect = parentRef.current.getBoundingClientRect();
//       newX = Math.max(0, Math.min(newX, parentRect.width - width));
//       newY = Math.max(0, Math.min(newY, parentRect.height - height));
//     }

//     setPosition({ x: newX, y: newY });
//     onPositionChange?.(id, newX, newY);
//   };

//   const handleMouseUp = () => setIsDragging(false);

//   useEffect(() => {
//     if (mode !== "draggable") return;
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, offset, mode]);

//   // const Component = as;

//   return (
//     <ElementBase
//       id={id}
//       className={className}
//       style={{
//         left: position.x,
//         top: position.y,
//         width: width,
//         minHeight: height,
//         cursor:
//           mode === "draggable"
//             ? isDragging
//               ? "grabbing"
//               : "grab"
//             : mode === "clickable"
//             ? "pointer"
//             : "default",
//         ...style,
//       }}
//       mode={mode}
//       action={action ?? undefined}
//       isTemplate={isTemplate}
//       onMouseDown={handleMouseDown}
//     >
//       {children}
//     </ElementBase>

//     // <div
//     //   className={`element ${className} ${isTemplate ? "icon" : ""}`}
//     //   style={{
//     //     position: isTemplate ? "relative" : "absolute",
//     //     left: position.x,
//     //     top: position.y,
//     //     width: width,
//     //     minHeight: height,
//     //     cursor:
//     //       mode === "draggable"
//     //         ? isDragging
//     //           ? "grabbing"
//     //           : "grab"
//     //         : mode === "clickable"
//     //         ? "pointer"
//     //         : "default",
//     //     backgroundColor: "lightgray",
//     //     display: "flex",
//     //     alignItems: "center",
//     //     justifyContent: "center",
//     //     userSelect: "none",
//     //     boxSizing: "border-box",
//     //     ...style,
//     //   }}
//     //   onMouseDown={handleMouseDown}
//     //   onClick={mode == "clickable" && action ? () => action(): undefined}
//     // >
//     //   {children ?? "element"}
//     // </div>
//   );
// };
