/**
 * Enum for states a vertex can be in.
 *
 * @enum {string}
 */
export const VERTEX_STATES = {
  unexplored: 'unexplored',
  explored: 'explored',
}

/**
 * Represents a single graph vertex.
 */
export class Vertex {
  /**
   * Constructor method.
   *
   * @param {number} xPos x-position of the vertex
   * @param {number} yPos y-position of the vertex
   * @param {number} id id of the vertex
   */
  constructor(xPos, yPos, id) {
    this.xPos = xPos
    this.yPos = yPos
    this.id = id
    this.incomingEdges = []
    this.outgoingEdges = []
    this.state = VERTEX_STATES.unexplored
  }
}
