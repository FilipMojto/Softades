import React, { useEffect, useRef, useState } from "react";
import { ToolPanel } from "./ToolPanel";
import { Workspace } from "./Workspace";
import { DEF_HEIGHT, DEF_WIDTH } from "./UML/UseCaseBubble";
import {
  ConnectorProps,
  relationshipUUIDMap,
  uuidToRelationshipMap,
} from "./UML/Connector";
import { NodeProps } from "./UML/Node";
import { AnyNode } from "./UML/Element";
import { v4 as uuidv4 } from "uuid";

export const ModelEditor: React.FC = ({}) => {
  const appRef = useRef<HTMLDivElement>(null);
  const elementIdRef = useRef<string>(uuidv4());


  const updateElements = (elements: AnyNode[]) => {
    setConnectors((prevConnectors) =>
      prevConnectors.map((conn) => {
        const source = elements.find((el) => el.id === conn.source.id);
        const target = elements.find((el) => el.id === conn.target.id);

        return {
          ...conn,
          source: source ?? conn.source,
          target: target ?? conn.target,
        };
      })
    );
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    console.log(id, x, y);
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((el) =>
        el.id === id ? { ...el, x, y } : el
      );
      updateElements(updatedNodes);
      return updatedNodes;
    });
  };

  const handleDimensionChange = (id: string, width: number, height: number) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((el) =>
        el.id === id ? { ...el, width, height } : el
      );
      updateElements(updatedNodes);
      return updatedNodes;
    });
  };

  // Refs for all state variables
  const connTemplateClickedRef = useRef<boolean>(false);
  const targetConnRef = useRef<ConnectorProps["relationship"] | undefined>(
    undefined
  );
  const sourceIDRef = useRef<string>("");
  const nodesRef = useRef<AnyNode[]>([]);
  const connectorsRef = useRef<ConnectorProps[]>([]);
  const curConnIDRef = useRef<number>(5);

  // State variables
  const [connTemplateClicked, setConnTemplateClicked] =
    useState<boolean>(false);
  const [targetConn, setTargetConn] = useState<
    ConnectorProps["relationship"] | undefined
  >();
  const [sourceID, setSourceID] = useState<string>("");
  // const [curConnID, setCurConnID] = useState<number>(5);

  const [nodes, setNodes] = useState<AnyNode[]>([
    // {
    //   id: useRef<string>("0"),
    //   x: 100,
    //   y: 200,
    //   width: DEF_WIDTH,
    //   height: DEF_HEIGHT,
    //   onDrag: (id: string) => {},
    //   onClick: (id: string) => onElementClicked(id),
    //   type: "UseCaseBubble",
    //   onPositionChange: handlePositionChange,
    //   onDimensionChange: handleDimensionChange,
    // },
    // {
    //   id: useRef<string>("1"),
    //   x: 100,
    //   y: 300,
    //   width: DEF_WIDTH,
    //   height: DEF_HEIGHT,
    //   onDrag: () => {},
    //   onClick: (id: string) => onElementClicked(id),
    //   type: "UseCaseBubble",
    //   onPositionChange: handlePositionChange,
    //   onDimensionChange: handleDimensionChange,
    // },
  ]);
  const [connectors, setConnectors] = useState<ConnectorProps[]>([
    // {
    //   id: "2",
    //   relationship: "include",
    //   source: nodes[0],
    //   target: nodes[1],
    // },
  ]);

  // Sync refs with state
  useEffect(() => {
    connTemplateClickedRef.current = connTemplateClicked;
  }, [connTemplateClicked]);

  useEffect(() => {
    targetConnRef.current = targetConn;
  }, [targetConn]);

  // useEffect(() => {
  //   curConnIDRef.current = curConnID;
  // }, [curConnID]);

  useEffect(() => {
    sourceIDRef.current = sourceID;
  }, [sourceID]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    connectorsRef.current = connectors;
  }, [connectors]);

  const addConnector = (id: string) => {
    console.log("add connector clicked!:", id);
    setConnTemplateClicked(true); // Update state
    setTargetConn(uuidToRelationshipMap[id]);
    console.log("Relationship for UUID:", uuidToRelationshipMap[id]);
    console.log("UUID for 'extends':", relationshipUUIDMap.extends);
  };

  const onElementClicked = (id: string) => {
    console.log(
      "sourceID:",
      sourceIDRef.current,
      "clicked id:",
      id,
      "targetConn:",
      targetConnRef.current
    );

    // Use ref values to get the latest state
    if (connTemplateClickedRef.current) {
      if (sourceIDRef.current === "") {
        setSourceID(id);
        console.log("sourceID set to:", id);
      } else {
        console.log("last node...");
        const source = nodesRef.current.find(
          (el) => el.id === sourceIDRef.current
        );
        const target = nodesRef.current.find((el) => el.id === id);

        console.log(
          "source:",
          source,
          "target:",
          target,
          "targetConn:",
          targetConnRef.current
        );

        if (
          source &&
          target &&
          targetConnRef.current &&
          ["include", "extends", "generalize"].includes(targetConnRef.current)
        ) {
          const relationship = targetConnRef.current as
            | "include"
            | "extends"
            | "generalize";
          setConnectors((prevConnectors) => [
            ...prevConnectors,
            {
              id: `${curConnIDRef.current}`,
              relationship: relationship,
              source: source,
              target: target,
            },
          ]);
          console.log("added new connector successfully!");

          setConnTemplateClicked(false);
          setTargetConn(undefined);
          curConnIDRef.current = curConnIDRef.current + 1;
          // setCurConnID((prev) => prev + 1);
          setSourceID("");
        } else {
          console.error(
            "500: Internal server error, source or target element not found."
          );
        }
      }
    } else {
      console.log("no connector clicked!: ", connTemplateClickedRef.current);
    }
  };

  return (
    <div id="model-editor" className="row">
      <ToolPanel
      curId={elementIdRef}
        addConnector={addConnector}
        setElements={setNodes}
        onElementClicked={onElementClicked}
        onDimensionChange={handleDimensionChange}
        onPositionChange={handlePositionChange}
      ></ToolPanel>
      <Workspace nodes={nodes} connectors={connectors}></Workspace>
    </div>
  );
};
