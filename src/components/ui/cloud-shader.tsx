import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uSpeed;
uniform float uCount;
uniform float uDensity;
uniform vec3 uSky;
uniform vec3 uCloud;
uniform vec3 uTint;
uniform vec2 uPointer;
uniform float uDark;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++){
    v += a * noise(p);
    p = p * 2.02 + vec2(11.3, 7.7);
    a *= 0.5;
  }
  return v;
}

float segmentDistance(vec2 p, vec2 a, vec2 b){
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// Stable, seeded bends let each strike grow a different jagged channel.
vec2 boltPoint(float stepIndex, float seed, float rootX, float aspect){
  float bend = (hash(vec2(seed + 7.1, stepIndex * 3.73)) - 0.5) * 0.052;
  float wander = sin(stepIndex * 0.57 + seed * 2.7) * 0.035;
  return vec2((rootX + bend + wander) * aspect, 0.83 - stepIndex * 0.046);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 st = vec2(uv.x * (uRes.x / uRes.y), uv.y);

  float t = uTime * uSpeed;
  st += (uPointer - 0.5) * vec2(0.055, 0.025);
  float acc = 0.0;
  float w = 0.0;
  for (int i = 0; i < 4; i++){
    float fi = float(i);
    if (fi >= uCount) break;
    float scale = 1.1 + fi * 1.05;
    float drift = t * (0.05 + fi * 0.03);
    float layer = fbm(st * scale + vec2(drift, -drift * 0.12 + fi * 3.1));
    float weight = 1.0 / (1.0 + fi * 0.6);
    acc += layer * weight;
    w += weight;
  }
  float clouds = acc / max(w, 0.001);

  // Distinct layered billows with enough definition on near-white surfaces.
  float band = smoothstep(-0.08, 0.26, uv.y);
  float lo = 0.48 - uDensity * 0.2;
  float d = smoothstep(lo, lo + 0.19, clouds);
  d = pow(d, 1.08) * mix(0.5, 1.0, band);

  // luminous rim where the billows break
  float edge = smoothstep(lo - 0.04, lo + 0.12, clouds) - smoothstep(lo + 0.12, lo + 0.42, clouds);

  float detail = fbm(st * 5.2 - vec2(t * 0.035, 2.7));
  float shade = smoothstep(0.34, 0.78, detail) * d;
  vec3 col = mix(uSky, uCloud, clamp(d * 1.28, 0.0, 1.0));
  col = mix(col, uTint, shade * mix(0.2, 0.11, uDark));
  col += mix(vec3(1.0), uTint, uDark * 0.35) * edge * mix(0.5, 0.32, uDark);

  // Fast leader, two uneven return strokes, and a faint afterglow.
  float cycle = floor(uTime / 8.2);
  float phase = mod(uTime, 8.2);
  float first = smoothstep(0.28, 0.305, phase) * (1.0 - smoothstep(0.37, 0.43, phase));
  float second = smoothstep(0.48, 0.495, phase) * (1.0 - smoothstep(0.56, 0.62, phase));
  float afterglow = smoothstep(0.65, 0.67, phase) * (1.0 - smoothstep(0.73, 0.83, phase));
  float strike = max(first, max(second * 0.8, afterglow * 0.3));
  float boltGlow = 0.0;
  if (strike > 0.001){
    float aspect = uRes.x / uRes.y;
    vec2 boltUV = vec2(uv.x * aspect, uv.y);
    float rootX = 0.23 + hash(vec2(cycle, 4.7)) * 0.54;
    float trunkDist = 10.0;
    float branchDist = 10.0;
    float branchCore = 0.0;
    for (int i = 0; i < 13; i++){
      float fi = float(i);
      vec2 a = boltPoint(fi, cycle, rootX, aspect);
      vec2 b = boltPoint(fi + 1.0, cycle, rootX, aspect);
      float visible = step(0.83 - clamp((phase - 0.28) / 0.09, 0.0, 1.0) * 0.64, 0.83 - (fi + 1.0) * 0.046);
      trunkDist = min(trunkDist, mix(10.0, segmentDistance(boltUV, a, b), visible));
    }
    // Three narrow forks split off the main channel, tapering into hairline twigs.
    for (int fork = 0; fork < 3; fork++){
      float f = float(fork);
      float origin = 3.0 + f * 3.0;
      vec2 previous = boltPoint(origin, cycle, rootX, aspect);
      float direction = mod(f, 2.0) < 1.0 ? -1.0 : 1.0;
      for (int j = 1; j <= 5; j++){
        float fj = float(j);
        vec2 next = previous + vec2(
          direction * (0.014 + hash(vec2(cycle + f * 5.3, fj)) * 0.017) * aspect,
          -0.026 - hash(vec2(cycle + f * 7.1, fj + 2.0)) * 0.016
        );
        float dist = segmentDistance(boltUV, previous, next);
        branchDist = min(branchDist, dist);
        branchCore = max(branchCore, exp(-dist * (850.0 + fj * 310.0)) * (1.0 - fj * 0.12));
        previous = next;
      }
    }
    float core = exp(-trunkDist * 1250.0) + branchCore * 0.7;
    float sheath = exp(-trunkDist * 260.0) + exp(-branchDist * 380.0) * 0.45;
    boltGlow = exp(-trunkDist * 44.0) + exp(-branchDist * 75.0) * 0.4;
    vec3 lightning = mix(vec3(0.94, 0.98, 1.0), uTint, 0.16);
    float cloudGate = mix(0.66, 1.0, smoothstep(0.05, 0.5, d));
    col += lightning * (core * 2.8 + sheath * 0.86 + boltGlow * 0.3) * strike * cloudGate;
    vec2 source = boltPoint(0.0, cycle, rootX, aspect);
    float cloudFlash = exp(-length((boltUV - source) * vec2(2.2, 3.0)) * 5.0);
    col += lightning * (d * 0.22 + cloudFlash * 0.15) * strike;
    boltGlow *= strike;
  }

  float alpha = clamp(d * mix(0.9, 0.72, uDark) + edge * 0.28 + boltGlow * 0.65, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}

`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function readColor(el: HTMLElement, value: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;width:0;height:0;opacity:0";
  probe.style.color = value;
  el.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  const m = resolved.match(/-?[\d.]+/g);
  if (!m) return [1, 1, 1];
  // Chrome may return oklab()/color() — fall back to canvas conversion.
  if (resolved.startsWith("rgb")) {
    return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
  }
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d");
  if (!ctx) return [1, 1, 1];
  ctx.fillStyle = resolved;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255];
}

export function CloudShader({
  className,
  speed = 1,
  count = 4,
  density = 0.5,
  opacity = 0.55,
}: {
  className?: string;
  speed?: number;
  count?: number;
  density?: number;
  opacity?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;

    const prog = gl.createProgram();
    const vertexShader = compile(gl, gl.VERTEX_SHADER, VERT);
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!prog || !vertexShader || !fragmentShader) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uSpeed = u("uSpeed");
    const uCount = u("uCount");
    const uDensity = u("uDensity");
    const uSky = u("uSky");
    const uCloud = u("uCloud");
    const uTint = u("uTint");
    const uPointer = u("uPointer");
    const uDark = u("uDark");

    gl.uniform1f(uSpeed, speed);
    gl.uniform1f(uCount, Math.max(1, Math.min(4, count)));
    gl.uniform1f(uDensity, density);
    gl.uniform2f(uPointer, 0.5, 0.5);

    const applyTheme = () => {
      const host = canvas.parentElement ?? document.body;
      gl.uniform3fv(
        uSky,
        readColor(host, "color-mix(in oklab, var(--primary) 30%, var(--background))"),
      );
      gl.uniform3fv(
        uCloud,
        readColor(
          host,
          "color-mix(in oklab, var(--primary) 62%, var(--background))",
        ),
      );
      gl.uniform3fv(uTint, readColor(host, "var(--primary)"));
      gl.uniform1f(uDark, document.documentElement.classList.contains("dark") ? 1 : 0);
    };

    applyTheme();

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = reduced ? 8 : (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    let pointerX = 0.5;
    let pointerY = 0.5;
    const onPointerMove = (event: PointerEvent) => {
      pointerX += (event.clientX / window.innerWidth - pointerX) * 0.18;
      pointerY += (1 - event.clientY / window.innerHeight - pointerY) * 0.18;
      gl.uniform2f(uPointer, pointerX, pointerY);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    const mo = new MutationObserver(applyTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [speed, count, density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("block h-full w-full", className)}
      style={{ opacity }}
    />
  );
}
