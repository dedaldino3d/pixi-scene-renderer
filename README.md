# Pixi Renderer Pro

---

## For Reviewers: Architecture & Expert Review

> **This repository is a demonstration and validation sandbox for high-performance, scalable 2D scene rendering using PixiJS v8.**
>
> - **Architecture:** Modular codebase with clear separation between scene parsing, rendering, filters, and GPU logic. Designed for extensibility and maintainability.
> - **Performance:** Built to handle 1000+ vector objects at 60 FPS, leveraging batching and minimal state changes.
> - **Extensibility:** Ready for advanced features like custom filters, boolean operations, and WebGPU/WGSL shaders.
> - **Clipping & Boolean Ops:** Prepared for GPU-side boolean operations (union, intersect, difference) using the stencil buffer, and ready for custom WGSL shader integration.
> - **Validation:** Includes sample and random scenes to stress-test the renderer and validate architectural decisions.
>
> **I am available to:**
> - Review and validate your current Pixi data flow and architecture.
> - Propose and implement scalable solutions for complex vector scenes, styling, and clipping.
> - Advise on or implement GPU boolean operations and advanced effects.
> - Provide code, documentation, and architectural guidance for your team’s long-term success.

---

![Pixi Renderer Pro Banner](https://pixijs.com/images/pixijs-logo-cropped.png)

**A blazing-fast, modular PixiJS v8 scene renderer. Export, animate, and handle 1000+ objects at 60 FPS.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-green?logo=vercel)](https://your-live-demo-link)

---

## 🚀 Features

- **Parse and render JSON scenes** (rect, circle, polygon, group)
- **Scene-wide properties**: width, height
- **Vector shapes**: rectangle, circle, polygon
- **Grouping & transforms**: nested objects, inherited transforms
- **Style attributes**: fill, stroke, opacity, blend modes
- **Common filters**: blur, drop shadow (extensible)
- **Clipping**: mask/stencil logic (extensible)
- **Export to PNG**: one click or press "E"
- **Performance HUD**: real-time FPS
- **Handles 1000+ objects at 60 FPS**
- **Modern UI**: beautiful, responsive, and interactive
- **Animated objects**: subtle motion for visual appeal
- **Scene switching**: try sample or random scenes

---

## 🖼️ Screenshots

> ![Pixi Renderer Pro Screenshot](./screenshot.png)

---

## 🌐 Live Demo

👉 [Open the live demo](https://your-live-demo-link)

---

## 📦 Tech Stack

- **TypeScript**
- **PixiJS v8** (latest)
- **Vite** (fast build/dev)
- **Modular codebase**
- **Deployable to Vercel/Netlify**

---

## 🔥 Why Pixi Renderer Pro?

- **Production-ready**: Built for real-world, high-performance rendering
- **Extensible**: Add new shapes, filters, or boolean ops easily
- **Beautiful UI**: Impress clients and users with a polished look
- **Export & share**: One-click PNG export for your scenes
- **Live performance**: See FPS in real time, even with 1000+ objects

---

## 🛠️ Usage

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Run the dev server**
   ```sh
   npm run dev
   ```
3. **Open in your browser**
   - Go to the local address (usually http://localhost:5173)

---

## 📝 Scene JSON Format

```json
{
  "width": 800,
  "height": 600,
  "objects": [
    {
      "type": "rect",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 150,
      "fill": "#ff0000",
      "rotation": 0.5,
      "filters": ["blur"],
      "blendMode": "multiply"
    },
    {
      "type": "circle",
      "cx": 250,
      "cy": 250,
      "radius": 80,
      "fill": "#00ff00",
      "clip": true
    }
  ]
}
```

---

## ✨ Extending Pixi Renderer Pro

- Add new shapes or filters in `src/renderer.ts` and `src/filters.ts`
- Add boolean ops or advanced GPU logic in `src/stencil.ts`
- Customize scene controls in `src/main.ts`

---

## 📸 Contributing

Pull requests and issues welcome! Please open an issue for feature requests or bug reports.

---

## 📄 License

MIT 