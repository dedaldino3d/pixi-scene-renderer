// @ts-ignore: style.css is present in the project
import './style.css';
import { renderScene, getApp } from './renderer';
import { createSobelFilter } from './wgsl-filters';

const appDiv = document.querySelector<HTMLDivElement>('#app');
if (!appDiv) throw new Error('Missing #app container');

const canvasContainer = document.getElementById('canvas-container')!;
const exportBtn = document.getElementById('export-btn')! as HTMLButtonElement;
const sceneSelect = document.getElementById('scene-select')! as HTMLSelectElement;
const randomizeBtn = document.getElementById('randomize-btn')! as HTMLButtonElement;
const hud = document.getElementById('hud')!;
const edgeToggleBtn = document.getElementById('edge-toggle-btn')! as HTMLButtonElement;
const operationSelect = document.getElementById('operation-select')! as HTMLSelectElement;
let edgeDetectionEnabled = false;

let perf = { fps: 0, drawCalls: 0 };
let perfInterval: any = null;

let currentScene: any = null;
let currentOperation: 'union' | 'intersect' | 'difference' = 'union';

async function loadScene(sceneName: string) {
  let url = '';
  if (sceneName === 'sample') url = '/scene-sample.json';
  else if (sceneName === 'random') url = '/scene-random.json';
  const res = await fetch(url);
  const scene = await res.json();
  // If the scene is random, generate 1000+ objects
  if (sceneName === 'random') {
    scene.objects = generateRandomObjects(1000, scene.width, scene.height);
    // If more than 2 objects, force operation to 'union'
    if (scene.objects.length > 2) {
      scene.operation = 'union';
      operationSelect.value = 'union';
      currentOperation = 'union';
    }
  }
  // If the scene has an operation, sync the dropdown and state (only on initial load)
  if (scene.operation) {
    currentOperation = scene.operation;
    operationSelect.value = scene.operation;
  } else {
    scene.operation = currentOperation;
  }
  currentScene = scene;
  await renderScene(scene, canvasContainer);
  if (edgeDetectionEnabled) {
    applyEdgeDetection(true);
  }
  startPerfHUD();
}

function generateRandomObjects(count: number, width: number, height: number) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() > 0.5) {
      arr.push({
        type: 'rect',
        x: Math.random() * (width - 30),
        y: Math.random() * (height - 30),
        width: 10 + Math.random() * 40,
        height: 10 + Math.random() * 40,
        fill: randomColor(),
        rotation: Math.random() * Math.PI * 2,
        opacity: 0.7 + 0.3 * Math.random(),
      });
    } else {
      arr.push({
        type: 'circle',
        cx: Math.random() * (width - 30),
        cy: Math.random() * (height - 30),
        radius: 5 + Math.random() * 20,
        fill: randomColor(),
        opacity: 0.7 + 0.3 * Math.random(),
      });
    }
  }
  return arr;
}

function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
}

function exportPNG() {
  const app = getApp();
  if (!app) return;
  const exportCanvas = app.renderer.extract.canvas(app.stage);
  exportCanvas?.toBlob?.((blob: Blob | null) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    // Animate export button
    exportBtn.classList.add('exported');
    setTimeout(() => exportBtn.classList.remove('exported'), 600);
  }, 'image/png');
}

exportBtn.addEventListener('click', exportPNG);
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'e') {
    exportPNG();
  }
});

sceneSelect.addEventListener('change', () => {
  loadScene(sceneSelect.value);
});

randomizeBtn.addEventListener('click', () => {
  if (sceneSelect.value === 'random') {
    loadScene('random');
  } else {
    sceneSelect.value = 'random';
    loadScene('random');
  }
});

operationSelect.addEventListener('change', () => {
  currentOperation = operationSelect.value as any;
  if (currentScene) {
    currentScene.operation = currentOperation;
    renderScene(currentScene, canvasContainer);
    if (edgeDetectionEnabled) {
      applyEdgeDetection(true);
    }
    startPerfHUD();
  }
});

edgeToggleBtn.addEventListener('click', () => {
  edgeDetectionEnabled = !edgeDetectionEnabled;
  edgeToggleBtn.setAttribute('aria-pressed', String(edgeDetectionEnabled));
  edgeToggleBtn.classList.toggle('active', edgeDetectionEnabled);
  applyEdgeDetection(edgeDetectionEnabled);
});

function startPerfHUD() {
  if (perfInterval) clearInterval(perfInterval);
  const app = getApp();
  if (!app) return;
  let lastFrames = 0;
  let lastTime = performance.now();
  perfInterval = setInterval(() => {
    const now = performance.now();
    const frames = app.ticker.count;
    perf.fps = Math.round((frames - lastFrames) * 1000 / (now - lastTime));
    lastFrames = frames;
    lastTime = now;
    // Pixi v8: drawCalls stats are not public by default
    hud.innerHTML = `FPS: <b>${perf.fps}</b><br>Draw Calls: <b>N/A</b>`;
  }, 500);
}

function applyEdgeDetection(enabled: boolean) {
  const app = getApp();
  if (!app) return;
  if (enabled) {
    const filter = createSobelFilter(app.renderer.width, app.renderer.height);
    app.stage.filters = [filter];
  } else {
    app.stage.filters = [];
  }
}

// Animate objects for visual appeal (gentle pulse/rotation)
function animateScene() {
  const app = getApp();
  if (!app) return;
  app.ticker.add(() => {
    if (!app.stage) return;
    for (const child of app.stage.children) {
      if ('rotation' in child) {
        child.rotation += 0.002;
      }
      if ('scale' in child) {
        const t = performance.now() * 0.001;
        const s = 1 + 0.05 * Math.sin(t + child.x + child.y);
        child.scale.set(s);
      }
    }
  });
}

// Initial load
loadScene('sample').then(animateScene);
