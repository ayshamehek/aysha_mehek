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

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 st = vec2(uv.x * (uRes.x / uRes.y), uv.y);

  float t = uTime * uSpeed;
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

  // soft billows spanning the whole sky, gently fading at the very bottom
  float band = smoothstep(-0.15, 0.35, uv.y);
  float lo = 0.46 - uDensity * 0.30;
  float d = smoothstep(lo, lo + 0.30, clouds);
  d = pow(d, 0.85) * mix(0.55, 1.0, band);

  // luminous rim where the billows break
  float edge = smoothstep(lo - 0.04, lo + 0.12, clouds) - smoothstep(lo + 0.12, lo + 0.42, clouds);

  vec3 col = mix(uSky, uCloud, clamp(d * 1.15, 0.0, 1.0));
  col += uTint * edge * 0.45;

  float alpha = clamp(d * 1.25 + edge * 0.35, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}

`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
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
  const ctx = c.getContext("2d")!;
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

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
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

    gl.uniform1f(uSpeed, speed);
    gl.uniform1f(uCount, Math.max(1, Math.min(4, count)));
    gl.uniform1f(uDensity, density);

    const applyTheme = () => {
      const host = canvas.parentElement ?? document.body;
      gl.uniform3fv(
        uSky,
        readColor(host, "color-mix(in oklab, var(--primary) 22%, var(--background))"),
      );
      gl.uniform3fv(
        uCloud,
        readColor(
          host,
          "color-mix(in oklab, var(--primary) 10%, var(--card))",
        ),
      );
      gl.uniform3fv(uTint, readColor(host, "var(--primary)"));
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
    const mo = new MutationObserver(applyTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
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
