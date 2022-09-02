import { state } from '@/js/state'

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
  canvas: '#333947'
}

const ARROW_SIDE_LENGTH = 40
const CANVAS_X_OFFSET = 400
const VERTEX_RADIUS = 40
const STROKE_WIDTH = 2

/**
 * 
 * @param {*} xPos 
 * @param {*} yPos 
 * @returns 
 */
const insertVertex = (xPos, yPos) => {
  /** Creating vertex list entry */
  let vertex = {
    xPos: xPos - CANVAS_X_OFFSET,
    yPos: yPos,
    id: state.currentVertexId,
    incomingEdges: [],
    outgoingEdges: [],
    state: VERTEX_STATES.unexplored,
  }
  state.vertices.push(vertex)
  state.initialVertices.push(vertex)
  state.currentVertexId++

  addVertexToStartVertexDropdown(vertex)

  return vertex
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
  /** Creating edge list entry */
  let edge = {
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
  vertex0.outgoingEdges.push(edge)
  if (isDirected) vertex1.incomingEdges.push(edge)
  else vertex1.outgoingEdges.push(edge)
  state.edges.push(edge)
  return edge
}

const drawGraph = () => {
  for (let vertex of state.initialVertices) {
    drawVertex(vertex, COLORS.white)
  }
  for (let edge of state.initialEdges) {
    drawEdge(edge, COLORS.white)
  }
}

/**
 * 
 * @param {*} vertex 
 * @param {*} vertexColor 
 */
const drawVertex = (vertex, vertexColor) => {
  state.vertexContext.beginPath()
  state.vertexContext.strokeStyle = vertexColor
  state.vertexContext.lineWidth = STROKE_WIDTH;
  state.vertexContext.arc(vertex.xPos, vertex.yPos, VERTEX_RADIUS, 0, 2 * Math.PI)
  state.vertexContext.stroke()
  state.vertexContext.fillStyle = COLORS.white
  state.vertexContext.font = '15pt Inter'
  state.vertexContext.textAlign = 'center'
  state.vertexContext.textBaseline = 'middle'
  state.vertexContext.fillText(vertex.id, vertex.xPos, vertex.yPos)
  state.vertexContext.stroke()
}

/**
 * 
 * @param {*} vertex 
 * @param {*} level 
 */
const drawVertexLevel = (vertex, level) => {
  state.vertexContext.font = '8pt Inter'
  state.vertexContext.fillStyle = COLORS.white
  state.vertexContext.textAlign = 'center'
  state.vertexContext.textBaseline = 'middle'
  state.vertexContext.fillText('Level: ' + level, vertex.xPos, vertex.yPos + 20)
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
  state.edgeContext.lineWidth = STROKE_WIDTH;
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
    state.edgeContext.fillStyle = COLORS.canvas
    state.edgeContext.fillRect(middleX - 20 / 2, middleY - 20 / 2, 20, 20)
    state.edgeContext.stroke()

    /** Drawing the weight text. */
    state.edgeContext.font = '15pt Inter'
    state.edgeContext.textAlign = 'center'
    state.edgeContext.textBaseline = 'middle'
    state.edgeContext.fillStyle = COLORS.white
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
const depthFirstSearchInit = async (startingVertex) => {
  beforeAlgorithm()
  await depthFirstSearch(startingVertex)
  for (let v of state.vertices) {
    sleep()
    if (v.state === VERTEX_STATES.unexplored) await depthFirstSearch(v)
  }
  afterAlgorithm()
}

/**
 * 
 * @param {*} startingVertex 
 */
const depthFirstSearch = async (startingVertex) => {
  /** TODO: Figure out state algorithm properly for directed and undirected edges */
  startingVertex.state = VERTEX_STATES.explored

  await sleep()
  drawVertex(startingVertex, COLORS.blue)
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
        drawEdge(e, COLORS.green)
        await depthFirstSearch(w)
      } else {
        drawEdge(e, COLORS.yellow)
        e.state = EDGE_STATES.backEdge
      }
    }
  }
}

const breadthFirstSearchInit = async (startingVertex) => {
  beforeAlgorithm()
  await breadthFirstSearch(startingVertex)
  for (let v of state.vertices) {
    let i = 0
    if (v.state === VERTEX_STATES.unexplored) {
      console.log("HEHEHE " + v.id)
      console.log(v)
      await breadthFirstSearch(v)
    }
  }
  afterAlgorithm()
}

/**
 * 
 * @param {*} startingVertex 
 */
const breadthFirstSearch = async (startingVertex) => {
  let l = []
  let l0 = []
  let i = 0

  startingVertex.state = VERTEX_STATES.explored

  drawVertex(startingVertex, COLORS.blue)
  drawVertexLevel(startingVertex, i)

  l0.push(startingVertex)
  l[0] = l0

  while (l[i].length > 0) {
    let liPlus1 = []
    l[i + 1] = liPlus1
    for (let v of l[i]) {
      await sleep()
      for (let e of v.outgoingEdges) {
        if (e.state === EDGE_STATES.unexplored) {
          /** Opposite edge from the vertex v */
          let w
          if (e.vertex0 == v) w = e.vertex1
          else if (e.vertex1 == v) w = e.vertex0

          if (w.state === VERTEX_STATES.unexplored) {
            e.state = EDGE_STATES.discoveryEdge
            w.state = VERTEX_STATES.explored
            
            drawEdge(e, COLORS.green)
            await sleep()
            drawVertex(w, COLORS.blue)
            drawVertexLevel(w, i + 1)
            
            l[i + 1].push(w)
          } else {
            e.state = EDGE_STATES.crossEdge
            drawEdge(e, COLORS.yellow)
          }
          await sleep()
        }
      }
    }
    i++
  }
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
  if (state.algorithmIsRunning) return
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
          drawEdge(newEdge, COLORS.white)
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
      return
    }
  }

  /** Insert and draw the vertex if no other special cases occured */
  let newVertex = insertVertex(event.clientX, event.clientY)
  drawVertex(newVertex, COLORS.white)
}

const backupGraph = () => {
  state.initialEdges = structuredClone(state.edges)
  state.initialVertices = structuredClone(state.vertices)
}

const beforeAlgorithm = () => {
  backupGraph()
  clearCanvas()
  restoreGraph()
  drawGraph()
  state.algorithmIsRunning = true
}

const afterAlgorithm = () => {
  state.algorithmIsRunning = false
}

const restoreGraph = () => {
  state.edges = structuredClone(state.initialEdges)
  state.vertices = structuredClone(state.initialVertices)
}

const resetState = () => {
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

/**
 * 
 */
const clearCanvas = () => {
  state.edgeContext.clearRect(0, 0, window.innerWidth - CANVAS_X_OFFSET, window.innerHeight)
  state.vertexContext.clearRect(0, 0, window.innerWidth - CANVAS_X_OFFSET, window.innerHeight)
}

const clearStartVertexDropdown = () => {
  let startEdgeSelect = document.getElementById('start-edge-select')
  while (startEdgeSelect.options.length > 0) startEdgeSelect.remove(0)
}

const addVertexToStartVertexDropdown = (vertex) => {
  let startEdgeSelect = document.getElementById('start-edge-select')
  let option = document.createElement('option')
  option.value = option.innerHTML = vertex.id
  startEdgeSelect.add(option)
}

/**
 * 
 */
export const init = () => {
  /** Initializing edge canvas */
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

  /** Initializing vertex canvas */
  let vertexCanvas = document.getElementById('vertex-canvas')
  vertexCanvas.height = window.innerHeight
  vertexCanvas.width = window.innerWidth - CANVAS_X_OFFSET

  let vertexContext = vertexCanvas.getContext('2d')
  state.vertexContext = vertexContext

  /** Initializing DFS button event handler. */
  document.getElementById('dfs-button').addEventListener('click', () => {
    if (state.algorithmIsRunning) return
    let select = document.getElementById('start-edge-select')
    let option = select.options[select.selectedIndex].value
    depthFirstSearchInit(state.vertices[option])
  })

  /** Initializing BFS button event handler. */
  document.getElementById('bfs-button').addEventListener('click', () => {
    if (state.algorithmIsRunning) return
    let select = document.getElementById('start-edge-select')
    let option = select.options[select.selectedIndex].value
    breadthFirstSearchInit(state.vertices[option])
  })

  /** Initializing initial graph button. TODO: Fix */
  document.getElementById('initial-button').addEventListener('click', () => {
    if (state.algorithmIsRunning) return
    clearCanvas()
    restoreGraph()
  })

  /** Initializing clear screen button. */
  document.getElementById('clear-button').addEventListener('click', () => {
    clearCanvas()
    clearStartVertexDropdown()
    resetState()
  })

  /** Setting disclaimer text. */
  document.getElementById('disclaimer').innerText = new Date().getFullYear() + ' Amar Tabakovic'
}
