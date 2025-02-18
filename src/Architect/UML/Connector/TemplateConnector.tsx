import React from "react";
import { Relationship, ConnectorLine, ConnectorText } from "./ConnectorBase";
import { ElementProps, Element } from "../Element";
import ConnectorMarkers from "../Marker";

export const DEF_FROM_X = 0;
export const DEF_FROM_Y = 60;
export const DEF_TO_X = 198;
export const DEF_TO_Y = 60;

export interface TemplateConnectorProps extends ElementProps {
  relationship: Relationship;
}

export const TemplateConnector: React.FC<TemplateConnectorProps> = ({
  id,
  relationship: relationshipType,
  onClick = null,
  onClickClass = null,
}) => {
  const midX = (DEF_FROM_X + DEF_TO_X) / 2;
  const midY = (DEF_FROM_Y + DEF_TO_Y) / 2;

  return (
    <Element
      id={id}
      className="connector"
      onClickClass={onClickClass ?? ""}
      style={{
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
        viewBox="0 0 200 120"
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
