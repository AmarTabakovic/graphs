# graphs
A graph algorithm visualizer written in JavaScript using the Canvas API.

![Preview](docs/preview.gif)

Try it out under [graphs.amartabakovic.ch](https://graphs.amartabakovic.ch) (work in progress).
## Installation & Building
### Installation
```plaintext
npm install
```

### Development Build + Live Server
```plaintext
npm run start
```

### Production Build
```plaintext
npm run build
```

## Features
- Vertex and edge creation
    - Supports (un)weighted and (un)directed edges
- Algorithms
    - Depth-first search over all connected components from a starting vertex
    - Breadth-first search over all connected components from a starting vertex
    - Dijkstra's algorithm from a starting vertex
- Dynamic visualization speed
- Generation of randomized graphs

## Non-Features
- Responsive web design
- Currently unsupported on mobile and screens with a width and height smaller than 800px.

## Credits & Resources
- [webpack-boilerplate](https://github.com/taniarascia/webpack-boilerplate)
- *Algorithm Design and Applications* by Goodrich and Tamassia