import { state } from '@/js/state'

const VERTEX_STATES = {
  unexplored: 'unexplored',
  explored: 'explored',
}

const EDGE_STATES = {
  unexplored: 'unexplored',
  discoveryEdge: 'discoveryEdge',
  backEdge: 'backEdge',
  crossEdge: 'crossEdge',
}

const ARROW_LENGTH = 40
const CANVAS_X_OFFSET = 400
const VERTEX_RADIUS = 40

/**
 * 
 * @param {*} xPos 
 * @param {*} yPos 
 * @returns 
 */
const insertVertex = (xPos, yPos) => {
  let canvasVertex = {
    xPos: xPos - CANVAS_X_OFFSET,
    yPos: yPos,
    id: state.currentVertexId,
    incomingEdges: [],
    outgoingEdges: [],
    state: VERTEX_STATES.unexplored,
  }
  state.vertices.push(canvasVertex)
  state.currentVertexId++
  return canvasVertex
}

/**
 * 
 * @param {*} vertex0 
 * @param {*} vertex1 
 * @param {*} weight 
 * @param {*} isDirected 
 * @returns 
 */
const insertEdge = (vertex0, vertex1, weight, isDirected) => {
  /**
   * Creating edge list entry.
   */
  let canvasEdge = {
    vertex0: vertex0,
    vertex1: vertex1,
    isDirected: isDirected,
    weight: weight,
    state: EDGE_STATES.unexplored,
  }
  /**
   * Adding the new edge to the adjacency lists of both vertices.
   *
   * TODO: Handle undirected edges case.
   */
  vertex0.outgoingEdges.push(canvasEdge)
  if (isDirected) vertex1.incomingEdges.push(canvasEdge)
  else vertex1.outgoingEdges.push(canvasEdge)
  state.edges.push(canvasEdge)
  return canvasEdge
}

/**
 * 
 * @param {*} vertex 
 * @param {*} vertexColor 
 */
const drawVertex = (vertex, vertexColor) => {
  state.vertexContext.beginPath()
  state.vertexContext.strokeStyle = vertexColor
  state.vertexContext.arc(vertex.xPos, vertex.yPos, VERTEX_RADIUS, 0, 2 * Math.PI)
  state.vertexContext.stroke()
  state.vertexContext.fillStyle = 'white'
  state.vertexContext.font = '20px Inter'
  state.vertexContext.textAlign = 'center'
  state.vertexContext.textBaseline = 'middle'
  state.vertexContext.fillText(vertex.id, vertex.xPos, vertex.yPos)
  state.vertexContext.stroke()
}

/**
 * 
 * @param {*} edge 
 * @param {*} edgeColor 
 */
const drawEdge = (edge, edgeColor) => {
  let x0Pos = edge.vertex0.xPos
  let y0Pos = edge.vertex0.yPos
  let x1Pos = edge.vertex1.xPos
  let y1Pos = edge.vertex1.yPos
  /** Get the angle theta between the two points (x0, y0) and (x1, y1). */
  let theta = Math.atan2(y1Pos - y0Pos, x1Pos - x0Pos)
  /**
   * Calculate the lengths of the triangle sides in order for the
   * line to start from the circle border.
   *
   * In the diagram below, r ist the radius of the circle:
   *
   *       /|
   *      / |
   *  r  /  |
   *    /   | lenY
   *   /    |
   *  /     |
   * /_ _ _ |
   *   lenX
   *
   * Adding lenX and lenY to the center of the circle shifts
   * the starting position of the edge by a distance of r.
   */
  let lenX = Math.cos(theta) * VERTEX_RADIUS
  let lenY = Math.sin(theta) * VERTEX_RADIUS
  let middleX = (x0Pos + x1Pos) / 2
  let middleY = (y0Pos + y1Pos) / 2

  /** Drawing the edge. */
  state.edgeContext.beginPath()
  state.edgeContext.strokeStyle = edgeColor
  state.edgeContext.moveTo(x0Pos + lenX, y0Pos + lenY)
  state.edgeContext.lineTo(x1Pos - lenX, y1Pos - lenY)
  state.edgeContext.stroke()

  if (edge.isDirected) {
    state.edgeContext.fillStyle = edgeColor
    state.edgeContext.beginPath()

    /** First part of the arrowhead. */
    state.edgeContext.moveTo(x1Pos - lenX, y1Pos - lenY)
    state.edgeContext.lineTo()
    state.edgeContext.stroke()

    /** Second part of the arrowhead. */
    state.edgeContext.beginPath()
    state.edgeContext.moveTo(x1Pos - lenX, y1Pos - lenY)
    state.edgeContext.lineTo()
    state.edgeContext.stroke()
  }
  /** Unweighted edges don't need to display the zero. */
  if (edge.weight != 0) {
    /**
     * Drawing the dark background rectangle for the weight text.
     *
     * TODO: Delete a small section in the center of the edge instead of
     * drawing a rectangle.
     */
    state.edgeContext.beginPath()
    state.edgeContext.fillStyle = '#3B4252'
    state.edgeContext.fillRect(middleX - 20 / 2, middleY - 20 / 2, 20, 20)
    state.edgeContext.stroke()

    /** Drawing the weight text. */
    state.edgeContext.font = '20px Inter'
    state.edgeContext.textAlign = 'center'
    state.edgeContext.textBaseline = 'middle'
    state.edgeContext.fillStyle = 'white'
    state.edgeContext.fillText(edge.weight, middleX, middleY)
    state.edgeContext.stroke()
  }
}

/**
 * 
 * @param {*} eventXPos 
 * @param {*} eventYPos 
 * @param {*} vertex 
 * @returns 
 */
const checkClickedOnVertex = (eventXPos, eventYPos, vertex) =>
  Math.pow(eventXPos - CANVAS_X_OFFSET - vertex.xPos, 2) + Math.pow(eventYPos - vertex.yPos, 2) <=
  VERTEX_RADIUS * VERTEX_RADIUS

/**
 * 
 * @param {*} eventXPos 
 * @param {*} eventYPos 
 * @param {*} vertex 
 * @returns 
 */
const checkClickedNearVertex = (eventXPos, eventYPos, vertex) =>
  eventXPos - CANVAS_X_OFFSET <= vertex.xPos + 2 * VERTEX_RADIUS &&
  eventXPos - CANVAS_X_OFFSET >= vertex.xPos - 2 * VERTEX_RADIUS &&
  eventYPos <= vertex.yPos + 2 * VERTEX_RADIUS &&
  eventYPos >= vertex.yPos - 2 * VERTEX_RADIUS

/**
 * 
 */
const depthFirstSearch = async () => {
  for (let v of state.vertices) {
    sleep()
    if (v.state === VERTEX_STATES.unexplored) await depthFirstSearchRec(v)
  }
}

/**
 * 
 * @param {*} startingVertex 
 */
const depthFirstSearchRec = async (startingVertex) => {
  /** TODO: Figure out state algorithm properly for directed and undirected edges */
  startingVertex.state = VERTEX_STATES.explored

  await sleep()
  drawVertex(startingVertex, 'blue')
  await sleep()

  for (let e of startingVertex.outgoingEdges) {
    if (e.state === EDGE_STATES.unexplored) {
      /** Opposite edge from the starting vertex */
      let w
      if (e.vertex0 == startingVertex) w = e.vertex1
      else if (e.vertex1 == startingVertex) w = e.vertex0

      await sleep()

      if (w.state === VERTEX_STATES.unexplored) {
        e.state = EDGE_STATES.discoveryEdge
        drawEdge(e, 'green')
        await depthFirstSearchRec(w)
      } else {
        drawEdge(e, 'yellow')
        e.state = EDGE_STATES.backEdge
      }
    }
  }
}

/**
 * 
 * @param {*} startingVertex 
 */
const breadthFirstSearch = async (startingVertex) => {

}

/**
 * 
 * @returns 
 */
const sleep = () => new Promise((resolve) => setTimeout(resolve, 500))

/**
 * 
 * @param {*} event 
 * @returns 
 */
const handleCanvasClick = (event) => {
  let vertices = state.vertices
  let edges = state.edges
  /**
   * First iteration: check whether a vertex has been clicked on
   * and handle the event accordingly.
   */
  for (let vertex of vertices) {
    if (checkClickedOnVertex(event.clientX, event.clientY, vertex)) {
      if (state.clickedOnVertexOnce) {
        if (state.lastClickedVertex == vertex) {
          state.clickedOnVertexOnce = false
          state.lastClicked = null
        } else {
          for (let edge of edges) {
            if (
              (edge.vertex0.id == vertex.id && edge.vertex1.id == state.lastClickedVertex.id) ||
              (edge.vertex0.id == state.lastClickedVertex.id && edge.vertex1.id == vertex.id)
            ) {
              state.lastClickedVertex = null
              state.clickedOnVertexOnce = false
              return
            }
          }
          let weight = document.getElementById('weight-input').value
          let newEdge = insertEdge(state.lastClickedVertex, vertex, weight, false)
          drawEdge(newEdge, 'white')
          state.clickedOnVertexOnce = false
          state.lastClickedVertex = null
        }
      } else {
        state.clickedOnVertexOnce = true
        state.lastClickedVertex = vertex
      }
      return
    }
  }
  /**
   * Second iteration: check whether a click event occured near a vertex
   * (in order to avoid too close grouping of different vertices).
   */
  for (let vertex of vertices) {
    if (checkClickedNearVertex(event.clientX, event.clientY, vertex)) {
      state.clickedOnVertexOnce = false
      state.lastClickedVertex = null
      console.log('Clicked near vertex')
      return
    }
  }
  /** Insert and draw the vertex if no other special cases occured */
  let newVertex = insertVertex(event.clientX, event.clientY)
  drawVertex(newVertex, 'white')
}

/**
 * 
 */
export const init = () => {
  /** Initialize edge canvas */
  let edgeCanvas = document.getElementById('edge-canvas')
  edgeCanvas.height = window.innerHeight
  edgeCanvas.width = window.innerWidth - CANVAS_X_OFFSET

  let edgeContext = edgeCanvas.getContext('2d')
  state.edgeContext = edgeContext

  /**
   * Use the edge canvas (which lies on top of the vertex canvas)
   * to catch and handle click events.
   */
  edgeCanvas.addEventListener('click', handleCanvasClick)

  /** Initialize vertex canvas */
  let vertexCanvas = document.getElementById('vertex-canvas')
  vertexCanvas.height = window.innerHeight
  vertexCanvas.width = window.innerWidth - CANVAS_X_OFFSET

  let vertexContext = vertexCanvas.getContext('2d')
  state.vertexContext = vertexContext

  /** Initializing DFS button event handler. */
  document.getElementById('dfs-button').addEventListener('click', () => {
    depthFirstSearch(state.vertices[0])
  })

  /** Initializing BFS button event handler. */
  document.getElementById('bfs-button').addEventListener('click', () => {
    breadthFirstSearch(state.vertices[0])
  })
}