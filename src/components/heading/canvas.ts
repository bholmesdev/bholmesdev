const strokeWidth = 25;
const eraserWidth = 100;

export function setUpCanvas(
  container: HTMLElement,
  canvas: HTMLCanvasElement
): () => void {
  const colorMap = {
    red: getCssVar("--color-marker-red"),
    blue: getCssVar("--color-marker-blue"),
    green: getCssVar("--color-marker-green"),
    eraser: "white",
  };

  function getColor(name: string): string {
    if (name in colorMap) {
      return (colorMap as Record<string, string>)[name]!;
    }
    throw new Error(`Invalid color name: ${name}`);
  }

  function getCssVar(name: string) {
    return window.getComputedStyle(container).getPropertyValue(name);
  }

  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = colorMap.red;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const colorInputs: NodeListOf<HTMLInputElement> = container.querySelectorAll(
    'input[name="color"]'
  )!;
  for (const colorInput of colorInputs) {
    colorInput.addEventListener("change", (evt) => {
      const inputColor = (evt.currentTarget as HTMLInputElement)?.value;
      console.log(inputColor);
      ctx.strokeStyle = getColor(inputColor);
      ctx.lineWidth = inputColor === "eraser" ? eraserWidth : strokeWidth;
    });
    if (colorInput instanceof HTMLInputElement && colorInput.checked) {
      // Set to red marker if eraser is the initial selection.
      if (colorInput.value === "eraser") {
        const defaultInput = [...colorInputs].find((c) => c.value === "red")!;
        defaultInput.checked = true;
        colorInput.checked = false;
        continue;
      }
      ctx.strokeStyle = getColor(colorInput.value);
      ctx.lineWidth = colorInput.value === "eraser" ? eraserWidth : strokeWidth;
    }
  }

  type Point = { x: number; y: number };

  let drawing = false;
  let latestPoint: Point = { x: 0, y: 0 };

  function normalizePoint(point: Point): Point {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: point.x * scaleX,
      y: point.y * scaleY,
    };
  }

  function continueStroke(rawPoint: Point) {
    const point = normalizePoint(rawPoint);

    ctx.beginPath();
    ctx.moveTo(latestPoint.x, latestPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    latestPoint = point;
  }

  function startStroke(rawPoint: Point) {
    drawing = true;
    latestPoint = normalizePoint(rawPoint);
  }

  const BUTTON = 0b01;
  function isMouseButtonDown(buttons: number) {
    return (buttons & BUTTON) === BUTTON;
  }

  function onMouseMove(evt: MouseEvent) {
    if (!drawing) return;

    continueStroke({ x: evt.offsetX, y: evt.offsetY });
  }

  function onMouseDown(evt: MouseEvent) {
    if (drawing) return;

    evt.preventDefault();
    canvas.addEventListener("mousemove", onMouseMove, false);
    startStroke({ x: evt.offsetX, y: evt.offsetY });
  }

  function onMouseEnter(evt: MouseEvent) {
    if (!isMouseButtonDown(evt.buttons) || drawing) return;

    onMouseDown(evt);
  }

  function onStrokeEnd() {
    if (!drawing) return;

    drawing = false;
    canvas.removeEventListener("mousemove", onMouseMove, false);
  }

  function getTouchScreenPoint(evt: TouchEvent): Point {
    if (!evt.currentTarget) return { x: 0, y: 0 };
    const rect = (evt.currentTarget as HTMLElement).getBoundingClientRect();
    const touch = evt.targetTouches[0] ?? { clientX: 0, clientY: 0 };
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  function onTouchStart(evt: TouchEvent) {
    if (drawing) return;
    evt.preventDefault();
    startStroke(getTouchScreenPoint(evt));
  }

  function onTouchMove(evt: TouchEvent) {
    if (!drawing) return;

    continueStroke(getTouchScreenPoint(evt));
  }

  function onTouchEnd() {
    drawing = false;
  }

  const abort = new AbortController();

  canvas.addEventListener("mousedown", onMouseDown, { signal: abort.signal });
  canvas.addEventListener("mouseup", onStrokeEnd, { signal: abort.signal });
  canvas.addEventListener("mouseout", onStrokeEnd, { signal: abort.signal });
  canvas.addEventListener("mouseenter", onMouseEnter, { signal: abort.signal });
  canvas.addEventListener("touchstart", onTouchStart, { signal: abort.signal });
  canvas.addEventListener("touchend", onTouchEnd, { signal: abort.signal });
  canvas.addEventListener("touchcancel", onTouchEnd, { signal: abort.signal });
  canvas.addEventListener("touchmove", onTouchMove, { signal: abort.signal });

  return () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    abort.abort();
  };
}
