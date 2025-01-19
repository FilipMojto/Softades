// Draw a temporary line following the cursor
export function drawTemporaryLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Draw a line between two elements
export function drawLineBetweenElements(
  ctx: CanvasRenderingContext2D,
  el1: HTMLElement,
  el2: HTMLElement
): void {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2;
  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Clear the canvas and redraw all connections
export function redrawConnections(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  connections: [HTMLElement, HTMLElement][]
): void {
  clearCanvas(ctx, canvas);
  connections.forEach(([el1, el2]) => {
    drawLineBetweenElements(ctx, el1, el2);
  });
}

// Clear the canvas
export function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}