// Scene and object type definitions for Pixi Renderer Pro

export type BlendMode =
  | "normal"
  | "add"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export interface Scene {
  width: number;
  height: number;
  objects: SceneObject[];
}

export type SceneObject =
  | RectObject
  | CircleObject
  | PolygonObject
  | GroupObject;

export interface BaseObject {
  type: string;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number | { x: number; y: number };
  opacity?: number;
  fill?: string;
  stroke?: string;
  blendMode?: BlendMode;
  filters?: string[];
  clip?: boolean;
}

export interface RectObject extends BaseObject {
  type: "rect";
  width: number;
  height: number;
}

export interface CircleObject extends BaseObject {
  type: "circle";
  cx: number;
  cy: number;
  radius: number;
}

export interface PolygonObject extends BaseObject {
  type: "polygon";
  points: Array<{ x: number; y: number }>;
}

export interface GroupObject extends BaseObject {
  type: "group";
  objects: SceneObject[];
} 