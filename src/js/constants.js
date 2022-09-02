/** */
const VERTEX_STATES = {
  unexplored: 'unexplored',
  explored: 'explored',
}

/** */
const EDGE_STATES = {
  unexplored: 'unexplored',
  discoveryEdge: 'discoveryEdge',
  backEdge: 'backEdge',
  crossEdge: 'crossEdge',
}

const COLORS = {
  green: '#82a762',
  yellow: '#e1af4c',
  blue: '#4b6a91',
  white: '#e5e9f0',
  canvas: '#333947',
}

const ARROW_SIDE_LENGTH = 40
const CANVAS_X_OFFSET = 400
const VERTEX_RADIUS = 40
const STROKE_WIDTH = 2

export {
  VERTEX_STATES,
  VERTEX_RADIUS,
  EDGE_STATES,
  COLORS,
  ARROW_SIDE_LENGTH,
  CANVAS_X_OFFSET,
  STROKE_WIDTH,
}
