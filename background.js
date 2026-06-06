/**
 * background.js — Mouse-reactive glow parallax + canvas wave overlay
 */

const Background = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  time: 0,
  mouseX: 0.5,
  mouseY: 0.5,
  targetMouseX: 0.5,
  targetMouseY: 0.5,
  reducedMotion: false,
  container: null,
  glowOrange: null,
  glowRed: null,

  init() {
    this.container = document.getElementById('bg-waves');
    this.canvas = document.getElementById('wave-canvas');
    this.glowOrange = document.querySelector('.bg-waves__glow--orange');
    this.glowRed = document.querySelector('.bg-waves__glow--red');

    if (!this.container) return;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('mousemove', (e) => this.onPointer(e.clientX, e.clientY), { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (e.touches[0]) this.onPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });

      if (!this.reducedMotion) {
        this.animate();
      } else {
        this.draw(0);
      }
    }

    this.updateGlows();
  },

  resize() {
    if (!this.canvas || !this.ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.reducedMotion) this.draw(0);
  },

  onPointer(x, y) {
    this.targetMouseX = x / window.innerWidth;
    this.targetMouseY = y / window.innerHeight;
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;
    this.updateGlows();
  },

  animate() {
    this.time += 0.012;
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;
    this.draw(this.time);
    this.updateGlows();
    requestAnimationFrame(() => this.animate());
  },

  updateGlows() {
    const ox = (this.mouseX - 0.5) * 60;
    const oy = (this.mouseY - 0.5) * 45;
    const rx = (0.5 - this.mouseX) * 50;
    const ry = (0.5 - this.mouseY) * 40;
    const tiltX = (this.mouseY - 0.5) * 3;
    const tiltY = (this.mouseX - 0.5) * -3;

    if (this.glowOrange) {
      this.glowOrange.style.transform = `translate(${ox}px, ${oy}px)`;
    }
    if (this.glowRed) {
      this.glowRed.style.transform = `translate(${rx}px, ${ry}px)`;
    }
    if (this.container && !this.reducedMotion) {
      this.container.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  },

  draw(t) {
    if (!this.ctx) return;
    const { ctx, width, height } = this;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const baseAlpha = isDark ? 0.14 : 0.1;

    ctx.clearRect(0, 0, width, height);

    const mouseShift = (this.mouseX - 0.5) * 40;
    const mouseLift = (this.mouseY - 0.5) * 25;

    const layers = [
      { amp: 32, freq: 0.0035, speed: 1.0, y: height * 0.55, fill: `rgba(255, 102, 0, ${baseAlpha})` },
      { amp: 24, freq: 0.0045, speed: 1.4, y: height * 0.65, fill: `rgba(255, 0, 64, ${baseAlpha * 0.9})` },
      { amp: 20, freq: 0.003, speed: 0.7, y: height * 0.35, fill: `rgba(255, 102, 0, ${baseAlpha * 0.7})` },
    ];

    layers.forEach((layer, i) => {
      this.drawWave(layer, t, mouseShift * (0.4 + i * 0.2), mouseLift * (0.3 + i * 0.15));
    });
  },

  drawWave(layer, t, shiftX, shiftY) {
    const { ctx, width, height } = this;
    const points = [];
    const phase = t * layer.speed + shiftX * 0.03;

    for (let x = 0; x <= width; x += 8) {
      const y = layer.y + shiftY
        + Math.sin(x * layer.freq + phase) * layer.amp
        + Math.sin(x * layer.freq * 1.6 + phase * 0.5) * (layer.amp * 0.4);
      points.push({ x, y });
    }

    ctx.beginPath();
    ctx.moveTo(0, height);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = layer.fill;
    ctx.fill();
  }
};
