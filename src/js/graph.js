import { state } from './state'
import * as constants from './constants'

/**
 *
 * @param {*} xPos
 * @param {*} yPos
 * @returns
 */
export const insertVertex = (xPos, yPos) => {
  /** Creating vertex list entry */
  let vertex = {
    xPos: xPos - constants.CANVAS_X_OFFSET,
    yPos: yPos,
    id: state.currentVertexId,
    incomingEdges: [],
    outgoingEdges: [],
    state: constants.VERTEX_STATES.unexplored,
  }
  state.vertices.push(vertex)
  state.initialVertices.push(vertex)
  state.currentVertexId++

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
export const insertEdge = (vertex0, vertex1, weight, isDirected) => {
  /** Creating edge list entry */
  let edge = {
    vertex0: vertex0,
    vertex1: vertex1,
    isDirected: isDirected,
    weight: weight,
    state: constants.EDGE_STATES.unexplored,
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
