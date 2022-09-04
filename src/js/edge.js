/**
 * Enum for states an edge can be in.
 *
 * @enum {string}
 */
export const EDGE_STATES = {
  unexplored: 'unexplored',
  discoveryEdge: 'discoveryEdge',
  backEdge: 'backEdge',
  crossEdge: 'crossEdge',
}

/**
 * Represents a single graph edge.
 */
export class Edge {
  /**
   * Constructor method.
   *
   * @param {Vertex} vertex0 first vertex of the edge
   * @param {Vertex} vertex1 second vertex of the edge
   * @param {number} weight weight of the edge
   * @param {boolean} isDirected whether the edge is directed
   */
  constructor(vertex0, vertex1, weight, isDirected) {
    this.vertex0 = vertex0
    this.vertex1 = vertex1
    this.weight = weight
    this.isDirected = isDirected
    this.state = EDGE_STATES.unexplored

    vertex0.outgoingEdges.push(this)

    /** If an edge is undirected, always treat it as an outgoing edge. */
    if (isDirected) vertex1.incomingEdges.push(this)
    else vertex1.outgoingEdges.push(this)
  }
}