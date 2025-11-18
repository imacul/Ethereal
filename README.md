# Ethereal Fish Ribbon - 3D THREE.js Tutorial

Welcome to **Ethereal**, a mesmerizing 3D demo based on [Animtheme’s YouTube tutorial](https://youtu.be/NDAwC1ywnis?si=moiM6FJkooe8fpxp). This project showcases glowing ribbons and gently floating lanterns in THREE.js, perfect for learning animation, post-processing, and interactive controls.

## Demo Preview

![Preview Image](https://github.com/imacul/Ethereal/assets/preview.gif)  
*Watch the full tutorial on [YouTube](https://youtu.be/NDAwC1ywnis?si=moiM6FJkooe8fpxp)*

---

## Features

- Ethereal glowing "fish ribbon" animated with Catmull-Rom splines.
- Smooth color transitions using vertex-colors for a gradient effect.
- Hundreds of floating lanterns using THREE.InstancedMesh for maximum performance.
- Interactive camera controls via OrbitControls.
- Bloom/glow effect via EffectComposer + UnrealBloomPass.
- Fully responsive window resizing.

---

## Getting Started

### Prerequisites

- Node.js & npm recommended (for `three` install), or serve as a static HTML if preferred.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imacul/Ethereal.git
   cd Ethereal
   ```

2. **Install dependencies:**
   ```bash
   npm install three
   ```

3. **Start server (optional, with Python):**
   ```bash
   python -m http.server
   ```
   Or use any web server / live server extension.

---

## Usage

1. Open `index.html` (or main JS file, see below).
2. The demo should load with the animated ethereal ribbon and lanterns.
3. Controls: Click and drag to orbit, scroll to zoom.

---

## Code Structure

Core file:

- **main.js (or your entry JS file):**
  - Sets up THREE.js scene, camera, and renderer.
  - Configures post-processing bloom effect.
  - Creates and animates the fish ribbon and lanterns.
  - Handles responsiveness and animation loop.

### Key Concepts

- **CatmullRomCurve3:** For dynamic fish ribbon movement.
- **TubeGeometry:** Creates the ribbon mesh along the curve.
- **Vertex Colors:** Used for head-to-tail color gradient.
- **InstancedMesh:** Efficient lantern rendering/animation.
- **OrbitControls:** User interaction with camera.
- **EffectComposer & UnrealBloomPass:** Realistic glow/bloom.

---

## Attribution

- Inspired by [Animtheme](https://animtheme.com/) marketplace for dev & designers.
- [YouTube tutorial](https://youtu.be/NDAwC1ywnis?si=moiM6FJkooe8fpxp) by Animtheme.

---

## Customization

- Tweak CURVE_POINTS, ribbon thickness, colors for artistic variations.
- Change `lanternCount` for more/fewer floating lanterns.
- Experiment with bloom and glow parameters for desired effect.

---

## License

MIT

---

## Contact / Feedback

Feel free to open an [issue](https://github.com/imacul/Ethereal/issues) for bugs, suggestions, or questions.

---

**Enjoy your ethereal animation journey!**
