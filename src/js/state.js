/**
 * Global state variables.
 *
 * TODO: Yeah, yeah, global vars are the source of evil hurr durr...
 */
const state = {
  edgeContext: null,
  vertexContext: null,
  currentVertexId: 0,
  lastClickedVertex: null,
  canvasGraphRestored: false,
  algorithmIsRunning: false,
  visualizationDelay: 500,
}

/**
 * Resets the state of the application except for the canvas contexts.
 */
const resetState = () => {
  state.clickedOnVertexOnce = false
  state.currentRunningAlgorithm = null
  state.lastClickedVertex = null
  state.currentVertexId = 0
  state.algorithmIsRunning = false
}

export { state, resetState }
