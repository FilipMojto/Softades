import React, { useRef, useState } from "react";
import { Element, ElementProps } from "./Element";
import { Node, NodeProps, NodeType } from "./Node";
import { v4 as uuidv4 } from "uuid";

export const DEF_WIDTH = 200;
export const DEF_HEIGHT = 100;
export const DEF_X = 0;
export const DEF_Y = 0;

export interface UseCaseBubbleProps extends NodeProps {
  type?: NodeType;
}

export const UseCaseBubble: React.FC<UseCaseBubbleProps> = ({
  type = "UseCaseBubble",
  id,
  x = DEF_X,
  y = DEF_Y,
  height = DEF_HEIGHT,
  width = DEF_WIDTH,
  style,
  onClick = null,
  onDrag = null,
  // mode,
  // action = null,
  onPositionChange,
  onDimensionChange,
  constraintArea: parentRef = null,
  isTemplate: isIcon = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [heightState, setHeight] = useState(`${height}px`); // Initial height

  const handleInput = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const parentComputedStyle = textareaRef.current.parentElement
      ? window.getComputedStyle(textareaRef.current.parentElement)
      : null;
    const parentPaddingTop = parseFloat(parentComputedStyle?.paddingTop ?? "0");
    const parentPaddingBottom = parseFloat(
      parentComputedStyle?.paddingBottom ?? "0"
    );
    const computedStyle = window.getComputedStyle(textarea);
    console.log("height before auto:", parseFloat(computedStyle.height));
    // Reset height before measuring
    textarea.style.height = "auto";
    console.log("height after auto:", parseFloat(computedStyle.height));

    // Get computed padding from the TEXTAREA itself (not the parent)
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

    // Get line height
    const lineHeight = parseFloat(computedStyle.lineHeight); // Default fallback
    const minHeight = lineHeight * 2; // Minimum 2 lines

    // Calculate new height (scrollHeight already includes borders)
    let newHeight = textarea.scrollHeight;
    console.log("calculated height:", newHeight);

    // Enforce minimum height
    newHeight = Math.max(newHeight, minHeight);

    // Apply new height
    textarea.style.height = `${newHeight}px`;

    // Get label height
    const labelHeight = textarea.previousElementSibling?.clientHeight ?? 0;
    console.log("labelHeight:", labelHeight);
    console.log("totalHeight:", newHeight + labelHeight);

    // Ensure layout updates correctly (React state update)
    // requestAnimationFrame(() => {                       // 30 is a mystery number
    onDimensionChange?.(
      id,
      width,
      newHeight + labelHeight + parentPaddingBottom + parentPaddingTop
    );
    // });
  };

  return (
    <Node
      type={type}
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      // mode={mode}
      // action={action ?? undefined}
      onClick={onClick ?? undefined}
      onDrag={onDrag ?? undefined}
      onPositionChange={onPositionChange}
      onDimensionChange={onDimensionChange}
      constraintArea={parentRef ?? undefined}
      style={{ ...style, display: "flex", flexDirection: "column" }}
      className="usecase-bubble"
      isTemplate={isIcon}
    >
      {/* <label>UC01{id.current}</label> */}
      <textarea
        ref={textareaRef}
        placeholder="Description..."
        onInput={handleInput}
        style={
          {
            // resize: "none",
            // overflow: "hidden",
          }
        }
      />
    </Node>
  );
};
