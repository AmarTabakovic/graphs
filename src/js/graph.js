import { CANVAS_X_OFFSET, checkCoordsNearVertex, checkCoordsOnVertex } from './canvas'
import { Edge, EDGE_STATES } from './edge'
import { Vertex, VERTEX_STATES } from './vertex'

/**
 * Represents a single graph.
 */
class Graph {
  /**
   * Constructor method.
   */
  constructor() {
    this.vertices = []
    this.edges = []
    this.currentVertexId = 0
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
    this.currentVertexId++
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

  /**
   * Resets the graph's state to its initial state before an algorithm was run.
   */
  reset() {
    for (const vertex of this.vertices) {
      vertex.state = VERTEX_STATES.unexplored
    }

    for (const edge of this.edges) {
      edge.state = EDGE_STATES.unexplored
    }
  }

  /**
   * Returns a randomized graph.
   *
   * The formula for computing random numbers in a range is taken from here:
   * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
   *
   * @returns new graph with randomized vertices and edges
   */
  static createRandomizedGraph() {
    const randomizedGraph = new Graph()
    const randomVerticesMin = 5
    const randomVerticesMax = 15

    const numberOfVertices =
      Math.floor(Math.random() * (randomVerticesMax - randomVerticesMin + 1)) + randomVerticesMin

    const randomEdgesMin = numberOfVertices / 2

    /** n choose 4. */
    const randomEdgesMax = (numberOfVertices * (numberOfVertices - 1)) / 4

    const numberOfEdges =
      Math.floor(Math.random() * (randomEdgesMax - randomEdgesMin + 1)) + randomEdgesMin

    let i = 0

    /** Adding random vertices. */
    while (i < numberOfVertices) {
      /** Get random coordinates. */
      const offset = 120
      const maxX = window.innerWidth - CANVAS_X_OFFSET - offset
      const minX = 0 + offset
      const randX = Math.floor(Math.random() * (maxX - minX + 1)) + minX

      const maxY = window.innerHeight - offset
      const minY = 0 + offset
      const randY = Math.floor(Math.random() * (maxY - minY + 1)) + minY

      let shouldContinue = false

      /** Check whether there is already a vertex at the random x and y-positions. */
      for (const vertex of randomizedGraph.vertices) {
        if (
          checkCoordsNearVertex(randX, randY, vertex) ||
          checkCoordsOnVertex(randX, randY, vertex)
        ) {
          shouldContinue = true
          break
        }
      }

      if (shouldContinue) continue

      const newVertex = new Vertex(randX, randY, randomizedGraph.currentVertexId)
      randomizedGraph.insertVertex(newVertex)
      i++
    }

    i = 0

    /** Adding random edges. */
    while (i < numberOfEdges) {
      const randomVertexId0 = Math.floor(Math.random() * (randomizedGraph.vertices.length - 1))
      const randomVertexId1 = Math.floor(Math.random() * (randomizedGraph.vertices.length - 1))

      if (randomVertexId0 == randomVertexId1) continue

      const randomVertex0 = randomizedGraph.vertices[randomVertexId0]
      const randomVertex1 = randomizedGraph.vertices[randomVertexId1]

      let shouldContinue = false

      /** Check whether there is already an edge with the randomized vertices. */
      for (const edge of randomizedGraph.edges) {
        if (
          (randomVertex0 == edge.vertex0 && randomVertex1 == edge.vertex1) ||
          (randomVertex0 == edge.vertex1 && randomVertex1 == edge.vertex0)
        ) {
          shouldContinue = true
        }
      }
      if (shouldContinue) continue

      const randomWeight = Math.floor(Math.random() * 40)
      const randomDirected = Math.random() < 0.5

      const newEdge = new Edge(randomVertex0, randomVertex1, randomWeight, randomDirected)
      randomizedGraph.insertEdge(newEdge)
      i++
    }

    return randomizedGraph
  }
}

export { Graph }
