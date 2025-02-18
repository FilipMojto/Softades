import React, { useEffect, useRef, useState } from "react";
import { ToolPanel } from "./ToolPanel";
import { Workspace } from "./Workspace";
import { Relationship, relationships } from "./UML/Connector/ConnectorBase";
import {
  // ConnectorProps,
  relationshipUUIDMap,
  uuidToRelationshipMap,
} from "./UML/Connector/ConnectorBase";

import { AnyNode } from "./UML/Element";
import { v4 as uuidv4 } from "uuid";
import { ConnectorProps } from "./UML/Connector/Connector";

export const ModelEditor: React.FC = ({}) => {
  const elementIdRef = useRef<string>(uuidv4());

  const updateConnectors = (elements: AnyNode[]) => {
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

  const selectMode = useRef<boolean>(true);
  const toggleSelectMode = () => {
    setNodes((prevNodes) => {
      console.log("toggling mode: ", selectMode.current);
      const updatedNodes = prevNodes.map((el) => ({
        ...el,
        selectMode: selectMode.current,
      }));

      //toggle the selectMode
      selectMode.current = selectMode.current ? false : true;
      // this is probably unnecessary remove as soon as verified
      // updateConnectors(updatedNodes);
      return updatedNodes;
    });
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    console.log(id, x, y);
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((el) =>
        el.id === id ? { ...el, x, y } : el
      );
      updateConnectors(updatedNodes);
      return updatedNodes;
    });
  };

  const handleDimensionChange = (id: string, width: number, height: number) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((el) =>
        el.id === id ? { ...el, width, height } : el
      );
      updateConnectors(updatedNodes);
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

  const [nodes, setNodes] = useState<AnyNode[]>([]);
  const [connectors, setConnectors] = useState<ConnectorProps[]>([]);

  // Sync refs with state
  useEffect(() => {
    connTemplateClickedRef.current = connTemplateClicked;
  }, [connTemplateClicked]);

  useEffect(() => {
    targetConnRef.current = targetConn;
  }, [targetConn]);

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
    // toggling the select mode of each node
    toggleSelectMode();

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
          relationships.includes(targetConnRef.current as Relationship)
        ) {
          const relationship = targetConnRef.current as Relationship;

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
          setSourceID("");

          // we turn off the select mode
          toggleSelectMode();
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
