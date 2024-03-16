const strokeWidth = 25;

export function setUpCanvas(container: HTMLElement, canvas: HTMLCanvasElement) {
  const colorMap = {
    red: getCssVar("--red"),
    purple: getCssVar("--purple"),
    pink: getCssVar("--pink"),
    green: getCssVar("--green"),
  };

  function getCssVar(name: string) {
    return window.getComputedStyle(container).getPropertyValue(name);
  }

  const colorInputs = container.querySelectorAll('input[name="color"]')!;
  for (const colorInput of colorInputs) {
    colorInput.addEventListener("change", (evt) => {
      const inputColor = (evt.currentTarget as HTMLInputElement)?.value;
      if (!(inputColor in colorMap)) return;

      const color =
        (colorMap as Record<string, string>)[inputColor] ?? colorMap.purple;

      ctx.strokeStyle = color;
    });
  }

  type Point = { x: number; y: number };

  let drawing = false;
  let latestPoint: Point = { x: 0, y: 0 };

  const ctx = canvas.getContext("2d")!;

  ctx.strokeStyle = colorMap.purple;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

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

  function onStrokeEnd(evt: MouseEvent) {
    if (!drawing) return;

    drawing = false;
    canvas.removeEventListener("mousemove", onMouseMove, false);
  }

  function getTouchScreenPoint(evt: TouchEvent): Point {
    if (!evt.currentTarget) return { x: 0, y: 0 };
    const rect = (evt.currentTarget as HTMLElement).getBoundingClientRect();
    const touch = evt.targetTouches[0];
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

  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onStrokeEnd, false);
  canvas.addEventListener("mouseout", onStrokeEnd, false);
  canvas.addEventListener("mouseenter", onMouseEnter, false);
  canvas.addEventListener("touchstart", onTouchStart, false);
  canvas.addEventListener("touchend", onTouchEnd, false);
  canvas.addEventListener("touchcancel", onTouchEnd, false);
  canvas.addEventListener("touchmove", onTouchMove, false);
}
