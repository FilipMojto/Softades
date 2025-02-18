import React from "react";
import { AnyNode, Element, ElementProps } from "../Element";
import { v4 as uuidv4 } from "uuid";
import ConnectorMarkers from "../Marker";

// as const prevents widening the array into string[]
export const relationships = [
  "associate",
  "include",
  "extends",
  "generalize",
] as const;
// creating the type like this increases the code maintainability but I dont
// if as const was not used above some problems with infering the relationships into this type
// may occur
export type Relationship = (typeof relationships)[number];

// Generate a mapping of each Relationship type to a unique UUID
export const relationshipUUIDMap: Record<Relationship, string> = {
  associate: uuidv4(),
  include: uuidv4(),
  extends: uuidv4(),
  generalize: uuidv4(),
};

// Reverse mapping: UUID → Relationship
export const uuidToRelationshipMap: Record<string, Relationship> =
  Object.fromEntries(
    Object.entries(relationshipUUIDMap).map(([key, value]) => [
      value,
      key as Relationship,
    ])
  );

export const getLineStyle = (
  relationshipType: Relationship,
  color: string = "black"
) => {
  switch (relationshipType) {
    case "include":
    case "extends":
      return { stroke: color, strokeWidth: 2, strokeDasharray: "5,5" }; // Dashed line
    case "generalize":
    case "associate":
      return { stroke: color, strokeWidth: 2 }; // Solid line
    default:
      return { stroke: color, strokeWidth: 1 };
  }
};

export const getMarkerEnd = (relationshipType: Relationship) => {
  switch (relationshipType) {
    case "include":
      return "url(#dashed-arrow)"; // Dashed arrowhead
    case "extends":
      return "url(#dashed-arrow)"; // Dashed arrowhead
    case "generalize":
      return "url(#generalize-arrow)"; // Solid arrowhead
    default:
      return undefined;
  }
};

export const getIntersectionWithBoundary = (
  center: { x: number; y: number },
  direction: { x: number; y: number },
  nodeX: number,
  nodeY: number,
  nodeWidth: number,
  nodeHeight: number
) => {
  if (direction.x === 0 && direction.y === 0) {
    console.warn("Direction vector is zero, cannot compute intersection.");
    return center;
  }

  // Calculate the intersection with the element's boundaries
  const tx1 = (nodeX - center.x) / direction.x;
  const tx2 = (nodeX + nodeWidth - center.x) / direction.x;
  const ty1 = (nodeY - center.y) / direction.y;
  const ty2 = (nodeY + nodeHeight - center.y) / direction.y;

  // Find the minimum positive t value (closest intersection)
  const t = Math.min(...[tx1, tx2, ty1, ty2].filter((t) => t > 0));

  // Calculate the intersection point
  // 12 here is a mysterious calculation deviation
  return {
    x: center.x + direction.x * t,
    y: center.y + direction.y * t,
  };
};

export interface ConnectorLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  relationshipType: Relationship;
}

export const ConnectorLine: React.FC<ConnectorLineProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  relationshipType,
}) => {
  const linePath = `M ${fromX} ${fromY} L ${toX} ${toY}`;

  return (
    <path
      d={linePath}
      style={getLineStyle(relationshipType)}
      markerEnd={getMarkerEnd(relationshipType)}
    />
  );
};

export interface ConnectorTextProps {
  midX: number;
  midY: number;
  relationshipType: Relationship;
}

export const ConnectorText: React.FC<ConnectorTextProps> = ({
  midX,
  midY,
  relationshipType,
}) => {
  return (
    <text
      x={midX}
      y={midY}
      textAnchor="middle"
      alignmentBaseline="middle"
      style={{
        fontSize: "0.8rem",
        fontWeight: "bold",
        fill: "black",
      }}
    >
      {`<<${relationshipType}>>`}
    </text>
  );
};