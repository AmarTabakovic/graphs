/**
 * Represents a single graph.
 */
export class Graph {
  /**
   * Constructor method.
   */
  constructor() {
    this.vertices = []
    this.edges = []
  }

  /**
   * Inserts a given vertex into the graph.
   *
   * TODO: Exception handling.
   *
   * @param {Vertex} vertex
   */
  insertVertex(vertex) {
    this.vertices.push(vertex)
  }

  /**
   * Inserts a given edge into the graph.
   *
   * TODO: Exception handling.
   *
   * @param {Edge} edge
   */
  insertEdge(edge) {
    this.edges.push(edge)
  }
}
