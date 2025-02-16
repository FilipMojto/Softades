import React from "react";
import Client from "react-dom/client";
// import { Workspace } from "./Architect/Workspace";
import { ModelEditor } from "./Architect/ModelEditor";

async function setupApp(container: HTMLElement) {
  const root = Client.createRoot(container);
  root.render(<ModelEditor />);
  return root;
}

document.addEventListener("DOMContentLoaded", async () => {
  const root = setupApp(
    document.getElementById("main-content-container") as HTMLDivElement
  );
});
