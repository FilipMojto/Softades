import React from "react";
import { UseCaseBubble, DEF_WIDTH, DEF_HEIGHT } from "./UML/UseCaseBubble";
import {
  Connector,
  ConnectorProps,
  relationshipUUIDMap,
  TemplateConnector,
} from "./UML/Connector";
import { NodeProps } from "./UML/Node";
import { SystemBoundary } from "./UML/SystemBoundary";
import { v4 as uuidv4 } from "uuid";

export interface ToolPanelProps {
  setElements: React.Dispatch<React.SetStateAction<NodeProps[]>>;
  addConnector: (id: string) => void;
  onElementClicked: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onDimensionChange: (id: string, width: number, height: number) => void;
  curId: React.RefObject<string>;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({
  setElements,
  addConnector,
  onElementClicked,
  onPositionChange,
  onDimensionChange,
  curId,
}) => {
  const addBubble = () => {
    // Generate a new UUID for each bubble
    const newElementId = uuidv4();

    setElements((prevElements) => [
      ...prevElements,
      {
        id: newElementId, // Use the new UUID
        x: 200,
        y: 300,
        width: DEF_WIDTH,
        height: DEF_HEIGHT,
        type: "UseCaseBubble",
        onDrag: () => {},
        onClick: (id: string) => onElementClicked(id),
        onPositionChange: onPositionChange,
        onDimensionChange: onDimensionChange,
      },
    ]);
  };

  const addSystemBoundary = () => {
    setElements((prevElements) => [
      ...prevElements,
      {
        id: curId.current,
        type: "SystemBoundary",
        onDrag: () => {},
        onPositionChange: onPositionChange,
        onDimensionChange: onDimensionChange,
        resizable: true,
      },
    ]);
  };

  return (
    <div id="tool-panel" className="col-sm-3">
      <h3>Tools</h3>
      <UseCaseBubble
        id={curId.current}
        x={0}
        y={0}
        width={DEF_WIDTH}
        height={DEF_HEIGHT}
        onClick={addBubble}
        isTemplate
      ></UseCaseBubble>
      <TemplateConnector
        id={relationshipUUIDMap.include}
        fromX={0}
        fromY={60}
        toX={198}
        toY={60}
        relationship="include"
        isTemplate
        onClick={addConnector}
      ></TemplateConnector>
      <TemplateConnector
        id={relationshipUUIDMap.extends}
        fromX={0}
        fromY={60}
        toX={198}
        toY={60}
        relationship="extends"
        isTemplate
        onClick={addConnector}
      ></TemplateConnector>
      <TemplateConnector
        id={relationshipUUIDMap.generalize}
        fromX={0}
        fromY={60}
        toX={198}
        toY={60}
        relationship="generalize"
        isTemplate
        onClick={addConnector}
      ></TemplateConnector>
      <SystemBoundary
        id={curId.current}
        x={0}
        y={0}
        isTemplate
        onClick={addSystemBoundary}
        systemName="picka"
      ></SystemBoundary>
    </div>
  );
};