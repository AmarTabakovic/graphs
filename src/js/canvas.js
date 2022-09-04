import { state } from './state'
import { addVertexToStartVertexDropdown } from './ui'
import { Edge } from './edge'
import { Vertex } from './vertex'

/**
 * Enum for canvas colors.
 *
 * @enum {string}
 */
export const COLORS = {
  green: '#82a762',
  yellow: '#e1af4c',
  blue: '#4b6a91',
  white: '#e5e9f0',
  canvas: '#333947',
}

/** @constant */
export const CANVAS_X_OFFSET = 400

/** @constant */
const ARROW_SIDE_LENGTH = 40

/** @constant */
const VERTEX_RADIUS = 40

/** @constant */
const STROKE_WIDTH = 2

/** @constant */
const FONT_FAMILY = 'Inter'

/** @constant */
const FONT_SIZE_REGULAR = '15pt'

/** @constant */
const FONT_SIZE_SMALL = '8pt'

/**
 * Draws the vertices and edges of a given graph to the edge canvas
 * and vertex canvas.
 *
 * @param {Graph} graph graph to be drawn
 */
export const drawGraph = (graph) => {
  for (let vertex of graph.vertices) {
    drawVertex(vertex, COLORS.white)
  }
  for (let edge of graph.edges) {
    drawEdge(edge, COLORS.white)
  }
}

/**
 * Draws a given vertex to the vertex canvas in a given color.
 *
 * @param {Vertex} vertex vertex to be drawn
 * @param {COLORS} vertexColor color of the vertex
 */
export const drawVertex = (vertex, vertexColor) => {
  let vertexContext = state.vertexContext

  vertexContext.beginPath()
  vertexContext.strokeStyle = vertexColor
  vertexContext.lineWidth = STROKE_WIDTH
  vertexContext.arc(vertex.xPos, vertex.yPos, VERTEX_RADIUS, 0, 2 * Math.PI)
  vertexContext.stroke()
  vertexContext.fillStyle = COLORS.white
  vertexContext.font = FONT_SIZE_REGULAR + ' ' + FONT_FAMILY
  vertexContext.textAlign = 'center'
  vertexContext.textBaseline = 'middle'
  vertexContext.fillText(vertex.id, vertex.xPos, vertex.yPos)
  vertexContext.stroke()
}

/**
 * Draws a given subtext of a given vertex.
 *
 * This function is mostly intended for BFS and Dijkstra's algorithm
 * to display the level and the value respectively.
 *
 * @param {Vertex} vertex vertex to apply the subtext to
 * @param {string} subtext subtext to be drawn
 */
export const drawVertexSubtext = (vertex, subtext) => {
  let vertexContext = state.vertexContext

  vertexContext.font = FONT_SIZE_SMALL + ' ' + FONT_FAMILY
  vertexContext.fillStyle = COLORS.white
  vertexContext.textAlign = 'center'
  vertexContext.textBaseline = 'middle'
  vertexContext.fillText(subtext, vertex.xPos, vertex.yPos + 20)
  vertexContext.stroke()
}

/**
 * Draws a given edge in a given color.
 *
 * @param {Edge} edge edge to be drawn
 * @param {COLORS} edgeColor color of the edge
 */
export const drawEdge = (edge, edgeColor) => {
  let edgeContext = state.edgeContext

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
  edgeContext.beginPath()
  edgeContext.lineWidth = STROKE_WIDTH
  edgeContext.strokeStyle = edgeColor
  edgeContext.moveTo(x0Pos + lenX, y0Pos + lenY)
  edgeContext.lineTo(x1Pos - lenX, y1Pos - lenY)
  edgeContext.stroke()

  /** Directed edges get an arrowhead. */
  if (edge.isDirected) {
    edgeContext.fillStyle = edgeColor
    edgeContext.beginPath()

    /** First part of the arrowhead. */
    edgeContext.moveTo(x1Pos - lenX, y1Pos - lenY)
    edgeContext.lineTo()
    edgeContext.stroke()

    /** Second part of the arrowhead. */
    edgeContext.beginPath()
    edgeContext.moveTo(x1Pos - lenX, y1Pos - lenY)
    edgeContext.lineTo()
    edgeContext.stroke()
  }

  /** Unweighted edges don't need to display the zero. */
  if (edge.weight != 0) {
    /**
     * Drawing the dark background rectangle for the weight text.
     *
     * TODO: Delete a small section in the center of the edge instead of
     * drawing a rectangle.
     */
    edgeContext.beginPath()
    edgeContext.fillStyle = COLORS.canvas
    edgeContext.fillRect(middleX - 20 / 2, middleY - 20 / 2, 20, 20)
    edgeContext.stroke()

    /** Drawing the weight text. */
    edgeContext.font = FONT_SIZE_REGULAR + ' ' + FONT_FAMILY
    edgeContext.textAlign = 'center'
    edgeContext.textBaseline = 'middle'
    edgeContext.fillStyle = COLORS.white
    edgeContext.fillText(edge.weight, middleX, middleY)
    edgeContext.stroke()
  }
}

/**
 * Checks whether a vertex has been clicked on.
 *
 * @param {number} eventXPos x-position of the mouse click
 * @param {number} eventYPos y-position of the mouse click
 * @param {Vertex} vertex vertex to check
 * @returns true if a vertex has been clicked on, false otherwise
 */
const checkClickedOnVertex = (eventXPos, eventYPos, vertex) =>
  Math.pow(eventXPos - CANVAS_X_OFFSET - vertex.xPos, 2) + Math.pow(eventYPos - vertex.yPos, 2) <=
  VERTEX_RADIUS * VERTEX_RADIUS

/**
 * Checks whether a mouse click has occured near a vertex.
 *
 * This function also checks whether a vertex has been clicked on,
 * however the function checkClickedOnVertex() is recommended for
 * this purpose.
 *
 * @param {number} eventXPos x-position of the mouse click
 * @param {number} eventYPos y-position of the mouse click
 * @param {Vertex} vertex vertex to check
 * @returns true if a mouse click occured near a vertex, false otherwise
 */
const checkClickedNearVertex = (eventXPos, eventYPos, vertex) =>
  eventXPos - CANVAS_X_OFFSET <= vertex.xPos + 2 * VERTEX_RADIUS &&
  eventXPos - CANVAS_X_OFFSET >= vertex.xPos - 2 * VERTEX_RADIUS &&
  eventYPos <= vertex.yPos + 2 * VERTEX_RADIUS &&
  eventYPos >= vertex.yPos - 2 * VERTEX_RADIUS

/**
 * Handles an edge canvas click event and performs graph and canvas
 * mutations accordingly.
 *
 * This function immediately returns when an algorithm is running already.
 *
 * @param {object} event mouse click event
 */
export const handleCanvasClick = (event, graph) => {
  if (state.algorithmIsRunning) return
  let vertices = graph.vertices
  let edges = graph.edges

  /**
   * First iteration: check whether a vertex has been clicked on
   * and handle the event accordingly.
   */
  for (let vertex of vertices) {
    if (checkClickedOnVertex(event.clientX, event.clientY, vertex)) {
      if (state.lastClickedVertex != null) {
        if (state.lastClickedVertex == vertex) {
          state.lastClickedVertex = null
        } else {
          for (let edge of edges) {
            if (
              (edge.vertex0.id === vertex.id && edge.vertex1.id === state.lastClickedVertex.id) ||
              (edge.vertex0.id === state.lastClickedVertex.id && edge.vertex1.id === vertex.id)
            ) {
              state.lastClickedVertex = null
              return
            }
          }
          let weight = parseInt(document.getElementById('weight-input').value)
          if (isNaN(weight)) weight = 0

          let newEdge = new Edge(state.lastClickedVertex, vertex, weight, false)
          graph.insertEdge(newEdge)
          drawEdge(newEdge, COLORS.white)

          state.lastClickedVertex = null
        }
      } else {
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
      state.lastClickedVertex = null
      return
    }
  }

  /** Insert and draw the vertex if no other special cases occured */
  let newVertex = new Vertex(event.clientX - CANVAS_X_OFFSET, event.clientY, state.currentVertexId)
  graph.insertVertex(newVertex)
  addVertexToStartVertexDropdown(newVertex)
  drawVertex(newVertex, COLORS.white)
  state.currentVertexId++
}

/**
 * Clears the edge canvas and vertex canvas.
 */
export const clearCanvas = () => {
  state.edgeContext.clearRect(0, 0, window.innerWidth - CANVAS_X_OFFSET, window.innerHeight)
  state.vertexContext.clearRect(0, 0, window.innerWidth - CANVAS_X_OFFSET, window.innerHeight)
}
