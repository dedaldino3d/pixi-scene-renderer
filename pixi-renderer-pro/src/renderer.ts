import type { Scene, SceneObject, RectObject, CircleObject } from './types';
import { hexToPixiColor } from './utils';
import * as PIXI from 'pixi.js';

let app: PIXI.Application | null = null;

export async function renderScene(scene: Scene, container: HTMLElement) {
  // Destroy previous app if exists
  if (app) {
    app.destroy(true, { children: true });
    app = null;
    container.innerHTML = '';
  }

  app = new PIXI.Application();
  await app.init({
    width: scene.width,
    height: scene.height,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  container.appendChild(app.view as HTMLCanvasElement);

  // Render all objects
  for (const obj of scene.objects) {
    const displayObj = createDisplayObject(obj);
    if (displayObj) {
      app.stage.addChild(displayObj);
    }
  }
}

export function getApp(): PIXI.Application | null {
  return app;
}

function createDisplayObject(obj: SceneObject): PIXI.Graphics | PIXI.Container | null {
  switch (obj.type) {
    case 'rect':
      return createRect(obj as RectObject);
    case 'circle':
      return createCircle(obj as CircleObject);
    // TODO: polygon, group, etc.
    default:
      return null;
  }
}

function createRect(obj: RectObject): PIXI.Graphics {
  const g = new PIXI.Graphics();
  if (obj.fill) {
    g.beginFill(hexToPixiColor(obj.fill), obj.opacity ?? 1);
  }
  if (obj.stroke) {
    g.lineStyle(1, hexToPixiColor(obj.stroke), obj.opacity ?? 1);
  }
  g.drawRect(0, 0, obj.width, obj.height);
  g.endFill();
  applyCommonProps(g, obj);
  return g;
}

function createCircle(obj: CircleObject): PIXI.Graphics {
  const g = new PIXI.Graphics();
  if (obj.fill) {
    g.beginFill(hexToPixiColor(obj.fill), obj.opacity ?? 1);
  }
  if (obj.stroke) {
    g.lineStyle(1, hexToPixiColor(obj.stroke), obj.opacity ?? 1);
  }
  g.drawCircle(0, 0, obj.radius);
  g.endFill();
  applyCommonProps(g, obj);
  // Center at (cx, cy)
  g.x = obj.cx;
  g.y = obj.cy;
  return g;
}

function applyCommonProps(g: PIXI.Graphics, obj: any) {
  if (typeof obj.x === 'number') g.x = obj.x;
  if (typeof obj.y === 'number') g.y = obj.y;
  if (typeof obj.rotation === 'number') g.rotation = obj.rotation;
  if (typeof obj.scale === 'number') {
    g.scale.set(obj.scale);
  } else if (typeof obj.scale === 'object') {
    g.scale.set(obj.scale.x, obj.scale.y);
  }
  if (typeof obj.opacity === 'number') g.alpha = obj.opacity;
  // TODO: blendMode, filters, etc.
} 