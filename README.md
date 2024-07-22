# PolygonPlayground

PolygonPlayground is an interactive 3D physics simulation that brings geometric shapes to life in your browser. This project showcases the intersection of design and technology, offering a playful and engaging experience for users to explore the dynamic behavior of polygons in a virtual environment.

## Features

- Real-time 3D physics simulation
- Interactive camera controls
- Customizable parameters for experimentation
- Responsive design for various screen sizes

## How It Works

PolygonPlayground uses Three.js for 3D rendering and Cannon.js for physics simulations. The main components are:

1. **Container**: A 3D box that constrains the movement of the polygons.
2. **Polygons**: Represented as rounded boxes, these objects interact with each other and the container walls.
3. **Physics**: Gravity and collision detection create realistic movements and interactions.
4. **Camera**: An orbiting camera allows users to view the simulation from different angles.

## Customization

Designers and developers can easily modify the simulation to create unique experiences:

1. Adjust the `params` object in `sketch.js` to change the number of boxes, their size, container size, and gravity strength.
2. Modify the `styles.css` file to customize the appearance of the container and canvas.
3. Experiment with different geometric shapes by replacing the `RoundedBoxGeometry` in the `createBoxes` function.
4. Add new interactions or visual effects by extending the `render` function or creating new event listeners.

## Getting Started

To run PolygonPlayground locally:

1. Clone this repository
2. Open `index.html` in a modern web browser
3. Double-click anywhere in the container to throw the boxes

## Inspiration for Designers

PolygonPlayground serves as a starting point for various design explorations:

- Study how different parameters affect user perception and engagement
- Experiment with color schemes and visual styles to evoke different emotions
- Incorporate this simulation into larger interactive experiences or data visualizations
- Use it as a tool for teaching basic physics concepts in an intuitive, visual manner

We encourage you to fork this project, experiment with the code, and share your creations with the community. Let's push the boundaries of interactive design together!