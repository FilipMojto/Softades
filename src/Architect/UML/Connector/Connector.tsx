import React from "react";
import {
  ConnectorLine,
  ConnectorText,
  getIntersectionWithBoundary,
  Relationship,
} from "./ConnectorBase";
import { AnyNode } from "../Element";

export interface ConnectorProps {
  id: string;
  source: AnyNode;
  target: AnyNode;
  relationship: Relationship;
}

export const Connector: React.FC<ConnectorProps> = ({
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
