import React from "react";

const ConnectorMarkers = () => (
  <>
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
  </>
);

export default ConnectorMarkers;
