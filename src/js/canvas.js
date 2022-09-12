import { state } from './state'
import { addVertexToStartVertexDropdown } from './ui'
import { Edge } from './edge'
import { Vertex } from './vertex'

/**
 * Enum for canvas colors.
 *
 * @enum {string}
 */
const COLORS = {
  green: '#82a762',
  yellow: '#e1af4c',
  blue: '#4b6a91',
  white: '#e5e9f0',
  canvas: '#333947',
}

/** @constant */
const CANVAS_X_OFFSET = 400

/** @constant */
const ARROW_HEAD_LENGTH = 20

/** @constant */
const ARROW_HEAD_ANGLE = Math.PI / 8

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
const drawGraph = (graph) => {
  for (const vertex of graph.vertices) {
    drawVertex(vertex, COLORS.white)
  }
  for (const edge of graph.edges) {
    drawEdge(edge, COLORS.white)
  }
}

/**
 * Draws a vertex to the vertex canvas in a given color.
 *
 * @param {Vertex} vertex vertex to be drawn
 * @param {COLORS} vertexColor color of the vertex
 */
const drawVertex = (vertex, vertexColor) => {
  const vertexContext = state.vertexContext

  vertexContext.beginPath()
  vertexContext.strokeStyle = vertexColor
  vertexContext.fillStyle = COLORS.canvas
  vertexContext.lineWidth = STROKE_WIDTH
  vertexContext.arc(vertex.xPos, vertex.yPos, VERTEX_RADIUS, 0, 2 * Math.PI)
  vertexContext.fill()
  vertexContext.stroke()
  vertexContext.fillStyle = COLORS.white
  vertexContext.font = FONT_SIZE_REGULAR + ' ' + FONT_FAMILY
  vertexContext.textAlign = 'center'
  vertexContext.textBaseline = 'middle'
  vertexContext.fillText(vertex.id, vertex.xPos, vertex.yPos)
  vertexContext.stroke()
}

/**
 * Draws a subtext of a given vertex.
 *
 * This function is mostly intended for BFS and Dijkstra's algorithm
 * to display the level and the value respectively.
 *
 * @param {Vertex} vertex vertex to apply the subtext to
 * @param {string} subtext subtext to be drawn
 */
const drawVertexSubtext = (vertex, subtext) => {
  const vertexContext = state.vertexContext

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
const drawEdge = (edge, edgeColor) => {
  const edgeContext = state.edgeContext

  const x0Pos = edge.vertex0.xPos
  const y0Pos = edge.vertex0.yPos
  const x1Pos = edge.vertex1.xPos
  const y1Pos = edge.vertex1.yPos

  /** Get the angle theta between the two points (x0, y0) and (x1, y1). */
  const theta = Math.atan2(y1Pos - y0Pos, x1Pos - x0Pos)

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
  const lenX = Math.cos(theta) * VERTEX_RADIUS
  const lenY = Math.sin(theta) * VERTEX_RADIUS
  const middleX = (x0Pos + x1Pos) / 2
  const middleY = (y0Pos + y1Pos) / 2

  /** Drawing the edge. */
  edgeContext.beginPath()
  edgeContext.lineWidth = STROKE_WIDTH
  edgeContext.strokeStyle = edgeColor
  edgeContext.moveTo(x0Pos + lenX, y0Pos + lenY)
  edgeContext.lineTo(x1Pos - lenX, y1Pos - lenY)
  edgeContext.stroke()

  /**
   * Directed edges get an arrowhead.
   *
   * The formula behind drawing the arrowhead was mostly taken from here:
   * https://stackoverflow.com/questions/47079268/how-to-draw-arrow-head-with-coordinates
   */
  if (edge.isDirected) {
    edgeContext.fillStyle = edgeColor

    /** The point where the edge touches the vertex. */
    const xEdge = x1Pos - lenX
    const yEdge = y1Pos - lenY

    /** Direction vector from vertex 0 to vertex 1. */
    const vecX = xEdge - x0Pos
    const vecY = yEdge - y0Pos

    /** Normalizing the vector. */
    const vecLength = Math.sqrt(vecX * vecX + vecY * vecY)
    const unitX = vecX / vecLength
    const unitY = vecY / vecLength

    const arrowAngleCos = Math.cos(ARROW_HEAD_ANGLE)
    const arrowAngleSin = Math.sin(ARROW_HEAD_ANGLE)

    /** First part of the arrowhead. */
    edgeContext.beginPath()
    edgeContext.moveTo(xEdge, yEdge)

    /**
     * The diagram below shows the geometry of drawing the arrowhead:
     *
     *                                    x (xArrowHead1, yArrowHead1)
     *         , - ~ ~ ~ - ,             /                                  , - ~ ~ ~ - ,
     *     , '               ' ,        /                               , '               ' ,
     *   ,                       ,     /  } ARROW_HEAD_LENGTH         ,                       ,
     *  ,                         ,   /                              ,                         ,
     * ,                           , /                              ,                           ,
     * ,            (xEdge, yEdge) x/------------- ... -------------,                           ,
     * ,                           ,\                               ,                           ,
     *  ,         vertex1         ,  \                               ,         vertex0         ,
     *   ,                       ,    \                               ,                       ,
     *     ,                  , '      \                                ,                  , '
     *       ' - , _ _ _ ,  '           \                                 ' - , _ _ _ ,  '
     *                                   x (xArrowHead0, yArrowHead0)
     *
     */
    const xArrowHead0 = xEdge - (unitX * arrowAngleCos - unitY * arrowAngleSin) * ARROW_HEAD_LENGTH
    const yArrowHead0 = yEdge - (unitX * arrowAngleSin + unitY * arrowAngleCos) * ARROW_HEAD_LENGTH

    edgeContext.lineTo(xArrowHead0, yArrowHead0)
    edgeContext.stroke()

    /** Second part of the arrowhead. */
    edgeContext.beginPath()
    edgeContext.moveTo(xEdge, yEdge)

    const xArrowHead1 = xEdge - (unitX * arrowAngleCos + unitY * arrowAngleSin) * ARROW_HEAD_LENGTH
    const yArrowHead1 = yEdge - (-unitX * arrowAngleSin + unitY * arrowAngleCos) * ARROW_HEAD_LENGTH

    edgeContext.lineTo(xArrowHead1, yArrowHead1)
    edgeContext.stroke()
  }

  /** Unweighted edges don't need to display the zero. */
  if (edge.weight != 0) {
    /** Drawing the dark background rectangle for the weight text. */
    const rectHeight = 17
    const rectWidth = 12 * edge.weight.toString().length

    edgeContext.beginPath()
    edgeContext.fillStyle = COLORS.canvas
    edgeContext.fillRect(middleX - rectWidth / 2, middleY - rectHeight / 2, rectWidth, rectHeight)
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
 * Checks whether given x and y-coordinates lie on top of a given vertex.
 *
 * @param {number} xPos x-position
 * @param {number} yPos y-position
 * @param {Vertex} vertex vertex to check
 * @returns true if the given coordinates lie on a vertex, false otherwise
 */
const checkCoordsOnVertex = (xPos, yPos, vertex) =>
  Math.pow(xPos - vertex.xPos, 2) + Math.pow(yPos - vertex.yPos, 2) <= VERTEX_RADIUS * VERTEX_RADIUS

/**
 * Checks whether given x and y-coordinates lie in the vicinity a given vertex.
 *
 * The vicinity is defined as the square with the side lengths radius * 2.
 *
 * This function also checks whether the given x and y-coordinates
 * lie on top of a vertex, however the checkCoordsOnVertex() function
 * is recommended for that purpose.
 *
 * @param {number} xPos x-position
 * @param {number} yPos y-position
 * @param {Vertex} vertex vertex to check
 * @returns true if the given coordinates lie near a vertex, false otherwise
 */
const checkCoordsNearVertex = (eventXPos, eventYPos, vertex) =>
  eventXPos <= vertex.xPos + 2 * VERTEX_RADIUS &&
  eventXPos >= vertex.xPos - 2 * VERTEX_RADIUS &&
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
const handleCanvasClick = (event, graph) => {
  /** Don't do anytyhing if an algorithm is already running. */
  if (state.algorithmIsRunning) return

  const vertices = graph.vertices
  const edges = graph.edges

  /**
   * First iteration: check whether a vertex has been clicked on
   * and handle the event accordingly.
   */
  for (const vertex of vertices) {
    if (checkCoordsOnVertex(event.clientX - CANVAS_X_OFFSET, event.clientY, vertex)) {
      if (state.lastClickedVertex != null) {
        if (state.lastClickedVertex == vertex) {
          state.lastClickedVertex = null
        } else {
          for (const edge of edges) {
            if (
              (edge.vertex0.id === vertex.id && edge.vertex1.id === state.lastClickedVertex.id) ||
              (edge.vertex0.id === state.lastClickedVertex.id && edge.vertex1.id === vertex.id)
            ) {
              state.lastClickedVertex = null
              return
            }
          }
          const weight = parseInt(document.getElementById('weight-input').value)
          const isDirected =
            document.querySelector('input[name = "edge-type"]:checked').value == 'Directed'
          const newEdge = new Edge(state.lastClickedVertex, vertex, weight, isDirected)
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
   * in order to avoid grouping different vertices too close to each other.
   */
  for (const vertex of vertices) {
    if (checkCoordsNearVertex(event.clientX - CANVAS_X_OFFSET, event.clientY, vertex)) {
      state.lastClickedVertex = null
      return
    }
  }

  /** Insert and draw the vertex if no other special cases occured */
  const newVertex = new Vertex(
    event.clientX - CANVAS_X_OFFSET,
    event.clientY,
    graph.currentVertexId
  )
  graph.insertVertex(newVertex)
  addVertexToStartVertexDropdown(newVertex)
  drawVertex(newVertex, COLORS.white)
}

/**
 * Clears the edge canvas and vertex canvas.
 */
const clearCanvas = () => {
  state.edgeContext.clearRect(0, 0, window.innerWidth - CANVAS_X_OFFSET, window.innerHeight)
  state.vertexContext.clearRect(0, 0, window.innerWidth - CANVAS_X_OFFSET, window.innerHeight)
}

export {
  COLORS,
  CANVAS_X_OFFSET,
  drawVertexSubtext,
  drawVertex,
  drawEdge,
  drawGraph,
  checkCoordsOnVertex,
  checkCoordsNearVertex,
  handleCanvasClick,
  clearCanvas,
}
