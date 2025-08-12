(function () {
  "use strict";

  /**
   * Confetti controller using a fullscreen SVG overlay.
   * - Spawns rectangles at the click origin
   * - Animates with basic physics via requestAnimationFrame
   * - Cleans up when pieces leave the viewport
   */

  /** @typedef {{
   *  x: number,
   *  y: number,
   *  velocityX: number,
   *  velocityY: number,
   *  rotationDeg: number,
   *  angularVelocityDeg: number,
   *  width: number,
   *  height: number,
   *  color: string,
   *  node: SVGGElement
   * }} ConfettiPiece
   */

  const svgLayer = /** @type {SVGSVGElement} */ (document.getElementById("confetti-layer"));
  const button = /** @type {HTMLButtonElement} */ (document.getElementById("confettiButton"));

  if (!svgLayer || !button) return;

  const colorPalette = [
    "#f43f5e", // rose
    "#f59e0b", // amber
    "#10b981", // emerald
    "#3b82f6", // blue
    "#a855f7", // violet
    "#22d3ee", // cyan
  ];

  const gravityPixelsPerSecond2 = 1800; // gravity strength
  const terminalVelocity = 2400; // clamp falling speed
  const drag = 0.0008; // mild air resistance

  /** @type {ConfettiPiece[]} */
  let activePieces = [];
  let rafId = 0;
  let lastTimeMs = 0;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function sample(array) {
    return array[(Math.random() * array.length) | 0];
  }

  /** Create a single confetti SVG group */
  function createPieceNode(width, height, color) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(-width / 2));
    rect.setAttribute("y", String(-height / 2));
    rect.setAttribute("width", String(width));
    rect.setAttribute("height", String(height));
    rect.setAttribute("rx", String(Math.min(width, height) * 0.2));
    rect.setAttribute("fill", color);
    g.appendChild(rect);
    return g;
  }

  /** Spawn a burst of confetti pieces around (originX, originY) */
  function spawnConfettiBurst(originX, originY, count) {
    const { innerWidth: viewW, innerHeight: viewH } = window;

    const angleSpreadRad = Math.PI * 2; // 360 degrees
    for (let i = 0; i < count; i++) {
      const size = randomBetween(6, 12);
      const width = size * randomBetween(0.8, 1.4);
      const height = size * randomBetween(0.6, 1.2);
      const color = sample(colorPalette);

      // Direction biased slightly upward
      const angleRad = randomBetween(-Math.PI * 0.25, Math.PI * 1.25);
      const speed = randomBetween(400, 1400);

      const velocityX = Math.cos(angleRad) * speed;
      const velocityY = Math.sin(angleRad) * speed - randomBetween(400, 900);

      const rotationDeg = randomBetween(0, 360);
      const angularVelocityDeg = randomBetween(-720, 720);

      const node = createPieceNode(width, height, color);
      svgLayer.appendChild(node);

      /** @type {ConfettiPiece} */
      const piece = {
        x: originX + randomBetween(-16, 16),
        y: originY + randomBetween(-16, 16),
        velocityX,
        velocityY,
        rotationDeg,
        angularVelocityDeg,
        width,
        height,
        color,
        node,
      };
      activePieces.push(piece);

      // Initial paint
      node.setAttribute(
        "transform",
        `translate(${piece.x.toFixed(2)}, ${piece.y.toFixed(2)}) rotate(${piece.rotationDeg.toFixed(2)})`
      );
    }

    // Keep the SVG sized to the viewport in CSS; ensure a viewBox large enough
    svgLayer.setAttribute("viewBox", `0 0 ${viewW} ${viewH}`);

    if (!rafId) startAnimationLoop();
  }

  function startAnimationLoop() {
    lastTimeMs = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  /** Animation frame */
  function tick(nowMs) {
    const dt = Math.min(0.032, Math.max(0.001, (nowMs - lastTimeMs) / 1000)); // clamp dt
    lastTimeMs = nowMs;

    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    const wind = Math.sin(nowMs / 700) * 20; // gentle oscillating wind

    for (let i = activePieces.length - 1; i >= 0; i--) {
      const p = activePieces[i];

      // Physics integration (semi-implicit Euler)
      p.velocityX += wind * dt;
      p.velocityY += gravityPixelsPerSecond2 * dt;

      // Drag
      p.velocityX *= 1 - drag * Math.abs(p.velocityX);
      p.velocityY = Math.min(p.velocityY * (1 - drag * Math.abs(p.velocityY)), terminalVelocity);

      p.x += p.velocityX * dt;
      p.y += p.velocityY * dt;
      p.rotationDeg += p.angularVelocityDeg * dt;

      // Remove when far below viewport or far off-sides
      if (p.y - p.height > viewH + 120 || p.x < -160 || p.x > viewW + 160) {
        svgLayer.removeChild(p.node);
        activePieces.splice(i, 1);
        continue;
      }

      p.node.setAttribute(
        "transform",
        `translate(${p.x.toFixed(2)}, ${p.y.toFixed(2)}) rotate(${p.rotationDeg.toFixed(2)})`
      );
    }

    if (activePieces.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  // Handle button click
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    spawnConfettiBurst(originX, originY, prefersReduced ? 40 : 160);
  });

  // Resize: update SVG viewBox to match new viewport
  window.addEventListener("resize", () => {
    svgLayer.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
  });
})();