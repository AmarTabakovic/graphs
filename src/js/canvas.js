import { state } from './state'
import { STROKE_WIDTH, COLORS, VERTEX_RADIUS, CANVAS_X_OFFSET } from './constants'
import { insertVertex, insertEdge } from './graph'
import { addVertexToStartVertexDropdown } from './ui'

/**
 *
 */
export const drawGraph = () => {
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
export const drawVertex = (vertex, vertexColor) => {
  state.vertexContext.beginPath()
  state.vertexContext.strokeStyle = vertexColor
  state.vertexContext.lineWidth = STROKE_WIDTH
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
export const drawVertexLevel = (vertex, level) => {
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
export const drawEdge = (edge, edgeColor) => {
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
  state.edgeContext.lineWidth = STROKE_WIDTH
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
 * @param {*} event
 * @returns
 */
export const handleCanvasClick = (event) => {
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
          let weight = parseInt(document.getElementById('weight-input').value)
          if (isNaN(weight)) weight = 0
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
  addVertexToStartVertexDropdown(newVertex)
  drawVertex(newVertex, COLORS.white)
}

/**
 *
 */
export const clearCanvas = () => {
  state.edgeContext.clearRect(0, 0, window.innerWidth - CANVAS_X_OFFSET, window.innerHeight)
  state.vertexContext.clearRect(0, 0, window.innerWidth - CANVAS_X_OFFSET, window.innerHeight)
}
