import React, { useRef, useState } from "react";
// import { AnyElement, createElement, Element } from "./UML/Element";
import { Connector, ConnectorProps } from "./UML/Connector";
import { v4 as uuidv4 } from "uuid";

import {
  DEF_HEIGHT,
  DEF_WIDTH,
  UseCaseBubble,
  UseCaseBubbleProps,
} from "./UML/UseCaseBubble";
import {
  Class,
  DEF_WIDTH as CLS_DEF_WIDTH,
  DEF_HEIGHT as CLS_DEF_HEIGTH,
} from "./UML/Class";
import { NodeProps, NodeRenderer } from "./UML/Node";
import { AnyNode } from "./UML/Element";
import ConnectorMarkers from "./UML/Marker";

export interface WorkspaceProps {
  nodes: NodeProps[];
  connectors: ConnectorProps[];
  // setElements: React.Dispatch<React.SetStateAction<NodeProps[]>>;
  // setConnectors: React.Dispatch<React.SetStateAction<ConnectorProps[]>>;
  // onElementClicked: (id: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  nodes: elements,
  connectors,
}) => {
  const appRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="workspace"
      className="col-sm-9"
      ref={appRef}
      style={{ height: "100%", position: "relative" }} // Create a stacking context
    >
      {/* Render elements with a lower z-index */}
      {/* <div style={{ position: "relative", zIndex: 3 }}> */}
      
        {elements.map((el) => (
          
          <NodeRenderer
            key={el.id ? el.id : uuidv4()}
            x={el.x}
            constraintArea={appRef as React.RefObject<HTMLElement>}
            {...el}
          />
        ))}
      {/* </div> */}
  
      {/* Wrap the SVG in a div to control z-index without breaking layout */}
      <div
        style={{
          position: "absolute", // Overlay the workspace
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2, // Higher z-index to appear on top
          pointerEvents: "none", // Allow interaction with elements below
        }}
      >
        <svg
          id="lal"
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "transparent",
            position: "static", // Keep SVG's default positioning
          }}
        >
          <defs>
            <marker
              id="generalize-arrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="white" stroke="black" />
            </marker>
  
            <marker
              id="dashed-arrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path
                d="M 0 0 L 10 5 L 0 10"
                fill="none"
                stroke="black"
                strokeWidth="0.85"
              />
            </marker>
          </defs>
          <ConnectorMarkers></ConnectorMarkers>
  
          {connectors.map((connector) => (
            
            <Connector key={connector.id} {...connector}></Connector>
          ))}
        </svg>
      </div>
    </div>
  );
};
