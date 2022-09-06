import { CANVAS_X_OFFSET, checkCoordsNearVertex, checkCoordsOnVertex } from './canvas'
import { Edge } from './edge'
import { Vertex } from './vertex'

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
   * Returns a randomized graph.
   * 
   * The formula for computing random numbers in a range is taken from here:
   * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
   *
   * @returns graph with randomized vertices and edges
   */
  static createRandomizedGraph() {
    let randomizedGraph = new Graph()
    let randomVerticesMin = 5
    let randomVerticesMax = 15
    let numberOfVertices = Math.floor(Math.random() * (randomVerticesMax - randomVerticesMin + 1)) + randomVerticesMin

    let randomEdgesMin = numberOfVertices / 2

    /** n choose 4 */
    let randomEdgesMax = numberOfVertices * (numberOfVertices - 1) / 4

    let numberOfEdges = Math.floor(Math.random() * (randomEdgesMax - randomEdgesMin + 1)) + randomEdgesMin

    let i = 0

    /** Adding random vertices. */
    while (i < numberOfVertices) {
      /** Get random coordinates. */
      let offset = 120
      let maxX = window.innerWidth - CANVAS_X_OFFSET - offset
      let minX = 0 + offset
      let randX = Math.floor(Math.random() * (maxX - minX + 1)) + minX

      let maxY = window.innerHeight - offset
      let minY = 0 + offset
      let randY = Math.floor(Math.random() * (maxY - minY + 1)) + minY

      let shouldContinue = false

      /** Check whether there is already a vertex at the random x and y-positions. */
      for (let vertex of randomizedGraph.vertices) {
        if (
          checkCoordsNearVertex(randX, randY, vertex) ||
          checkCoordsOnVertex(randX, randY, vertex)
        ) {
          shouldContinue = true
          break
        }
      }

      if (shouldContinue) continue

      let newVertex = new Vertex(randX, randY, randomizedGraph.currentVertexId)
      randomizedGraph.insertVertex(newVertex)
      i++
    }

    i = 0

    /** Adding random edges. */
    while (i < numberOfEdges) {
      let randomVertexId0 = Math.floor(Math.random() * (randomizedGraph.vertices.length - 1))
      let randomVertexId1 = Math.floor(Math.random() * (randomizedGraph.vertices.length - 1))

      if (randomVertexId0 == randomVertexId1) continue

      let randomVertex0 = randomizedGraph.vertices[randomVertexId0]
      let randomVertex1 = randomizedGraph.vertices[randomVertexId1]

      let shouldContinue = false

      /** Check whether there is already an edge with the randomized vertices. */
      for (let edge of randomizedGraph.edges) {
        if (
          (randomVertex0 == edge.vertex0 && randomVertex1 == edge.vertex1) ||
          (randomVertex0 == edge.vertex1 && randomVertex1 == edge.vertex0)
        ) {
          shouldContinue = true
        }
      }
      if (shouldContinue) continue

      let randomWeight = Math.floor(Math.random() * 80) - 40
      let randomDirected = Math.random() < 0.5

      let newEdge = new Edge(randomVertex0, randomVertex1, randomWeight, randomDirected)
      randomizedGraph.insertEdge(newEdge)
      i++
    }

    return randomizedGraph
  }
}
