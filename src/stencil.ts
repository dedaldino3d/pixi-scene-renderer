import * as PIXI from 'pixi.js';
import type { SceneObject } from './types';
import { hexToPixiColor } from './utils';

export function renderBooleanOp(
  app: PIXI.Application,
  objA: SceneObject,
  objB: SceneObject,
  operation: 'union' | 'intersect' | 'difference'
) {
  if (operation === 'union') {
    // Use global positions for both shapes
    const gA = createGraphics(objA, false);
    const gB = createGraphics(objB, false);
    app.stage.addChild(gA);
    app.stage.addChild(gB);
  } else if (operation === 'intersect') {
    // TEST: Draw both shapes at global positions as siblings, set rect.mask = circle
    if (objA.type === 'rect' && objB.type === 'circle') {
      const rect = createGraphics(objA, false);
      const circle = createGraphics(objB, false);
      rect.mask = circle;
      app.stage.addChild(rect);
      app.stage.addChild(circle);
      // Debug outline for mask
      const circleOutline = createOutline(objB, false);
      app.stage.addChild(circleOutline);
    } else {
      // Fallback: just draw both shapes
      const gA = createGraphics(objA, false);
      const gB = createGraphics(objB, false);
      app.stage.addChild(gA);
      app.stage.addChild(gB);
    }
  } else if (operation === 'difference') {
    // Use global position for the first shape
    const gA = createGraphics(objA, false);
    app.stage.addChild(gA); // Needs special logic to subtract gB
  }
}

function createGraphics(obj: SceneObject, local = false): PIXI.Graphics {
  const g = new PIXI.Graphics();
  if (obj.type === 'rect') {
    g.beginFill(hexToPixiColor(obj.fill || '#fff'), obj.opacity ?? 1);
    g.drawRect(0, 0, (obj as any).width, (obj as any).height);
    g.endFill();
    g.position.set(local ? 0 : (obj as any).x ?? 0, local ? 0 : (obj as any).y ?? 0);
  } else if (obj.type === 'circle') {
    g.beginFill(hexToPixiColor(obj.fill || '#fff'), obj.opacity ?? 1);
    g.drawCircle(0, 0, (obj as any).radius);
    g.endFill();
    g.position.set(local ? 0 : (obj as any).cx ?? 0, local ? 0 : (obj as any).cy ?? 0);
  }
  return g;
}

function createOutline(obj: SceneObject, local = false): PIXI.Graphics {
  const g = new PIXI.Graphics();
  g.lineStyle(2, 0x00ffff, 1);
  if (obj.type === 'rect') {
    g.drawRect(0, 0, (obj as any).width, (obj as any).height);
    g.position.set(local ? 0 : (obj as any).x ?? 0, local ? 0 : (obj as any).y ?? 0);
  } else if (obj.type === 'circle') {
    g.drawCircle(0, 0, (obj as any).radius);
    g.position.set(local ? 0 : (obj as any).cx ?? 0, local ? 0 : (obj as any).cy ?? 0);
  }
  return g;
}