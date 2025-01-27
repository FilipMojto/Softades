import { redrawConnections, drawTemporaryLine } from "./properties/connectable";

const canvas = document.getElementById("lineCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const wrappables = document.querySelectorAll<HTMLTextAreaElement>(".content-element > textarea.wrappable");
const draggables = document.querySelectorAll<HTMLElement>(".content-element.draggable");
const connectables = document.querySelectorAll<HTMLElement>(".content-element.connectable");

const useCaseBubbles = document.querySelectorAll<HTMLElement>(".content-element.usecase-bubble");

useCaseBubbles.forEach(bubble => {
  bubble.setAttribute("title", "Use Case");
})

const associationArrows = document.querySelectorAll<HTMLElement>(".content-element.association-arrow");

associationArrows.forEach(arrow => {
  arrow.setAttribute("title", "Association");
})



let isDragging: boolean = false;
let currentDraggable: HTMLElement | null = null;
let offsetX: number = 0;
let offsetY: number = 0;

let isConnecting: boolean = false;
let startElement: HTMLElement | null = null;
let mouseX: number = 0;
let mouseY: number = 0;

// Array to store connections
const connections: [HTMLElement, HTMLElement][] = [];

// Resize canvas and redraw connections
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawConnections(ctx, canvas, connections); // Redraw all connections after resizing
});

// Auto-resize function for textareas
wrappables.forEach((wrappable) => {
  wrappable.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;
  });
});

// Click event for connectable elements
connectables.forEach((connectable) => {
  connectable.addEventListener("click", (event: MouseEvent) => {
    if (event.shiftKey) {
      if (!isConnecting) {
        isConnecting = true;
        startElement = connectable;
      }
    } else if (isConnecting) {
      isConnecting = false;
      if (startElement && startElement !== connectable) {
        connections.push([startElement, connectable]); // Save the connection
        redrawConnections(ctx, canvas, connections); // Redraw all connections
      }
      startElement = null;
    }
  });
});

// Mouse down: Start dragging
draggables.forEach((draggable) => {
  draggable.addEventListener("mousedown", function (event: MouseEvent) {
    if ((event.target as HTMLElement).tagName.toLowerCase() === "textarea") return;


    isDragging = true;
    currentDraggable = draggable;
    offsetX = event.clientX - draggable.offsetLeft;
    offsetY = event.clientY - draggable.offsetTop;
    draggable.style.cursor = "grabbing";
  });
});

// Mouse move: Drag the element or draw a temporary line
document.addEventListener("mousemove", (event: MouseEvent) => {
  if (isDragging && currentDraggable) {
    currentDraggable.style.left = `${event.clientX - offsetX}px`;
    currentDraggable.style.top = `${event.clientY - offsetY}px`;
    redrawConnections(ctx, canvas, connections); // Update connections while dragging
  } else if (isConnecting) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    redrawConnections(ctx, canvas, connections); // Clear canvas and redraw all lines
    if (startElement) {
      const rect = startElement.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      drawTemporaryLine(ctx, startX, startY, mouseX, mouseY);
    }
  }
});

// Mouse up: Stop dragging
document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    if (currentDraggable) {
      currentDraggable.style.cursor = "grab";
      currentDraggable = null;
    }
  }
});