import React from "react";
import { NodeProps } from "./Node";
import { AnyNode, Element, ElementProps } from "./Element";
import { v4 as uuidv4 } from "uuid";
import ConnectorMarkers from "./Marker";



// as const prevents widening the array into string[]
export const relationships = ["associate", "include", "extends", "generalize"] as const;
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

const getLineStyle = (
  relationshipType: Relationship,
  color: string = "black"
) => {
  // console.log("received", relationshipType);
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

const getMarkerEnd = (relationshipType: Relationship) => {
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

const getIntersectionWithBoundary = (
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

export interface ConnectorProps {
  id: string;
  source: AnyNode;
  target: AnyNode;
  relationship: Relationship;
}

export interface TemplateConnectorProps extends ElementProps {
  // fromX?: number;
  // fromY?: number;
  // toX?: number;
  // toY?: number;
  relationship: Relationship;
  // isTemplate?: boolean;
}

export interface ConnectorPathProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  relationshipType: Relationship;
}

export const ConnectorLine: React.FC<ConnectorPathProps> = ({
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

export const DEF_FROM_X = 0;
export const DEF_FROM_Y = 60;
export const DEF_TO_X = 198;
export const DEF_TO_Y = 60;


export const TemplateConnector: React.FC<TemplateConnectorProps> = ({
  id,
  // fromX,
  // fromY,
  // toX,
  // toY,
  relationship: relationshipType,
  // isTemplate = false,
  onClick = null,
  onClickClass = null,
}) => {
  // const linePath = `M ${fromX} ${fromY} L ${toX} ${toY}`;
  const midX = (DEF_FROM_X + DEF_TO_X) / 2;
  const midY = (DEF_FROM_Y + DEF_TO_Y) / 2;

  return (
    <Element
      id={id}
      className="connector"
      onClickClass={onClickClass ?? ""}
      style={{
        // width: isTemplate ? "fitContent" : "100%",
        width: "fitContent",
        height: "100%",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
      onClick={onClick ?? undefined}
      isTemplate={true}
    >
      <svg
        className="connector"
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "transparent",
          zIndex: -1,
        }}
        // viewBox={isTemplate ? "0 0 200 120" : undefined}
        viewBox="0 0 200 120"
        // preserveAspectRatio={isTemplate ? "xMidYMid meet" : "none"}
        preserveAspectRatio="xMidYMid meet"
      >
        <ConnectorMarkers></ConnectorMarkers>
        <ConnectorLine
          relationshipType={relationshipType}
          fromX={DEF_FROM_X}
          fromY={DEF_FROM_Y}
          toX={DEF_TO_X}
          toY={DEF_TO_Y}
        ></ConnectorLine>

        {(relationshipType === "include" ||
          relationshipType === "extends" ||
          relationshipType === "generalize") && (
          <ConnectorText
            relationshipType={relationshipType}
            midX={midX}
            midY={midY}
          />
        )}
      </svg>
    </Element>
  );
};

export const Connector: React.FC<ConnectorProps> = ({
  // id,
  source,
  target,
  relationship: relationshipType,
}) => {
  const sourceX = source.x as number;
  const sourceY = source.y as number;
  const sourceWidth = source.width as number;
  const sourceHeight = source.height as number;

  const targetX = target.x as number;
  const targetY = target.y as number;
  const targetWidth = target.width as number;
  const targetHeight = target.height as number;

  const fromCenter = {
    x: sourceX + sourceWidth / 2,
    y: sourceY + sourceHeight / 2,
  };

  const toCenter = {
    x: targetX + targetWidth / 2,
    y: targetY + targetHeight / 2,
  };

  const direction = {
    x: toCenter.x - fromCenter.x,
    y: toCenter.y - fromCenter.y,
  };

  const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
  if (length === 0) return; // Avoid division by zero

  const unitDirection = {
    x: direction.x / length,
    y: direction.y / length,
  };

  const fromIntersection = getIntersectionWithBoundary(
    fromCenter,
    unitDirection,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight
  );
  const toIntersection = getIntersectionWithBoundary(
    toCenter,
    { x: -unitDirection.x, y: -unitDirection.y },
    targetX,
    targetY,
    targetWidth,
    targetHeight
  );
  const midX = (fromIntersection.x + toIntersection.x) / 2;
  const midY = (fromIntersection.y + toIntersection.y) / 2;
  console.log("re-rendering connector...");

  return (
    <>
      <ConnectorLine
        fromX={fromIntersection.x}
        fromY={fromIntersection.y}
        toX={toIntersection.x}
        toY={toIntersection.y}
        relationshipType={relationshipType}
      />
      <ConnectorText
        midX={midX}
        midY={midY}
        relationshipType={relationshipType}
      />
    </>
  );
};
