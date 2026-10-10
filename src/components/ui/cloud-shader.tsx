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
uniform float uLightning;

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

// Large rounded billows, smaller turbulent lobes, and fine edge erosion.
float cloudField(vec2 p, float depth, float time){
  vec2 drift = vec2(time * 0.035, -time * 0.006);
  vec2 q = p * 2.25 + drift + vec2(depth * 0.3, depth * 0.12);
  vec2 warp = vec2(noise(q * 0.7 + 8.2), noise(q * 0.7 + 21.4));
  q += (warp - 0.5) * 0.8;
  float broad = noise(q * 0.65);
  float lobes = noise(q * 1.8);
  float fine = fbm(q * 4.0);
  float shape = broad * 0.68 + lobes * 0.24 + fine * 0.08;
  float threshold = 0.53 - uDensity * 0.16;
  float envelope = smoothstep(0.0, 0.2, depth) * (1.0 - smoothstep(0.6, 1.0, depth));
  return max(shape - threshold - (1.0 - envelope) * 0.075, 0.0) * 5.5;
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
  // Integrate translucent slices front-to-back instead of painting a flat noise mask.
  vec2 skyPoint = st * mix(0.85, 1.15, clamp(uCount / 4.0, 0.0, 1.0));
  vec2 lightDir = vec2(-0.09, 0.14);
  float transmittance = 1.0;
  vec3 scattering = vec3(0.0);
  float edge = 0.0;
  vec3 shadowCol = mix(uSky, uCloud, mix(0.38, 0.22, uDark));
  for (int i = 0; i < 7; i++){
    float depth = (float(i) + 0.5) / 7.0;
    float density = cloudField(skyPoint, depth, t);
    float towardLight = cloudField(skyPoint + lightDir, depth, t);
    float distantLight = cloudField(skyPoint + lightDir * 2.5, depth, t);
    float illumination = exp(-(towardLight * 1.8 + distantLight * 0.9));
    float rim = pow(clamp(1.0 - density * 2.0, 0.0, 1.0), 3.0) * illumination;
    vec3 sampleCol = mix(shadowCol, uCloud, 0.22 + illumination * 0.78);
    sampleCol = mix(sampleCol, uCloud, rim * 0.3);
    float sliceAlpha = 1.0 - exp(-density * 0.72);
    scattering += transmittance * sliceAlpha * sampleCol;
    edge += transmittance * sliceAlpha * rim;
    transmittance *= 1.0 - sliceAlpha;
  }
  float d = 1.0 - transmittance;
  vec3 col = scattering / max(d, 0.001);

  // Fast leader, two uneven return strokes, and a faint afterglow.
  float cycle = floor(uTime / 8.2);
  float phase = mod(uTime, 8.2);
  float first = smoothstep(0.28, 0.305, phase) * (1.0 - smoothstep(0.37, 0.43, phase));
  float second = smoothstep(0.48, 0.495, phase) * (1.0 - smoothstep(0.56, 0.62, phase));
  float afterglow = smoothstep(0.65, 0.67, phase) * (1.0 - smoothstep(0.73, 0.83, phase));
  float strike = max(first, max(second * 0.8, afterglow * 0.3)) * uLightning;
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
  lightningIntensity = 1,
}: {
  className?: string;
  speed?: number;
  count?: number;
  density?: number;
  opacity?: number;
  lightningIntensity?: number;
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
    const uLightning = u("uLightning");

    gl.uniform1f(uSpeed, speed);
    gl.uniform1f(uCount, Math.max(1, Math.min(4, count)));
    gl.uniform1f(uDensity, density);
    gl.uniform1f(uLightning, Math.max(0, Math.min(1.6, lightningIntensity)));
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
          "color-mix(in oklab, var(--primary) 8%, var(--cloud-highlight))",
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
  }, [speed, count, density, lightningIntensity]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("block h-full w-full", className)}
      style={{ opacity }}
    />
  );
}
