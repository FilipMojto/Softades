import React, { useRef } from "react";
import { Node, NodeProps, NodeType } from "./Node";

export const DEF_WIDTH = 200;
export const DEF_HEIGHT = 100;
export const DEF_X = 0;
export const DEF_Y = 0;

export interface UseCaseBubbleProps extends NodeProps {
  type?: NodeType;
  labelText?: string;
}

export const UseCaseBubble: React.FC<UseCaseBubbleProps> = ({
  type = "UseCaseBubble",
  labelText = "Title...",
  id,
  x = DEF_X,
  y = DEF_Y,
  height = DEF_HEIGHT,
  width = DEF_WIDTH,
  style,
  onClick = null,
  onDrag = null,
  onPositionChange,
  onDimensionChange,
  constraintArea: parentRef = null,
  isTemplate: isIcon = false,
  selectMode = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    // Reset height before measuring
    textarea.style.height = "auto";

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
    onDimensionChange?.(
      id,
      width,
      newHeight + labelHeight + parentPaddingBottom + parentPaddingTop
    );
  };

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
      onPositionChange={onPositionChange}
      onDimensionChange={onDimensionChange}
      constraintArea={parentRef ?? undefined}
      style={{ ...style, display: "flex", flexDirection: "column" }}
      className="usecase-bubble"
      isTemplate={isIcon}
      selectMode={selectMode}
    >
      <textarea
        ref={textareaRef}
        placeholder={labelText}
        onInput={handleInput}
      />
    </Node>
  );
};
