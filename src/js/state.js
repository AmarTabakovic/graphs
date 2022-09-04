export let state = {
  edgeContext: null,
  vertexContext: null,
  vertices: [],
  edges: [],
  initialVertices: [],
  initialEdges: [],
  currentVertexId: 0,
  clickedOnVertexOnce: false,
  lastClickedVertex: null,
  canvasGraphRestored: false,
  algorithmIsRunning: false,
  visualizationDelay: 500,
}

export const resetState = () => {
  state.edges = []
  state.vertices = []
  state.initialEdges = []
  state.initialVertices = []
  state.clickedOnVertexOnce = false
  state.currentRunningAlgorithm = null
  state.lastClickedVertex = null
  state.currentVertexId = 0
  state.algorithmIsRunning = false
}
