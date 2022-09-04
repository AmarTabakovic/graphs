import { state } from './state'
import { drawEdge, drawVertex, drawVertexSubtext, COLORS } from './canvas'
import { EDGE_STATES } from './edge'
import { VERTEX_STATES } from './vertex'

/**
 * Initializes a depth first search from a given starting vertex and
 * traverses any subsequent unvisited connected components.
 *
 * @param {Graph} graph graph containing all connected components
 * @param {Vertex} startingVertex first vertex from which to perform a DFS
 */
export const depthFirstSearchInit = async (graph, startingVertex) => {
  beforeAlgorithm()
  await depthFirstSearch(startingVertex)
  for (let v of graph.vertices) {
    if (v.state === VERTEX_STATES.unexplored) await depthFirstSearch(v)
  }
  afterAlgorithm()
}

/**
 * Performs a depth first search of the connected component
 * from a given starting vertex.
 *
 * @param {Vertex} startingVertex vertex to start the DFS from
 */
const depthFirstSearch = async (startingVertex) => {
  startingVertex.state = VERTEX_STATES.explored

  drawVertex(startingVertex, COLORS.blue)
  await sleep()

  for (let e of startingVertex.outgoingEdges) {
    if (e.state === EDGE_STATES.unexplored) {
      /** Opposite edge from the starting vertex. */
      let w
      if (e.vertex0 == startingVertex) w = e.vertex1
      else if (e.vertex1 == startingVertex) w = e.vertex0

      if (w.state === VERTEX_STATES.unexplored) {
        e.state = EDGE_STATES.discoveryEdge
        drawEdge(e, COLORS.green)
        await sleep()
        await depthFirstSearch(w)
      } else {
        e.state = EDGE_STATES.backEdge
        drawEdge(e, COLORS.yellow)
        await sleep()
      }
    }
  }
}

/**
 * Initializes a breadth first search from a given starting vertex and
 * traverses any subsequent unvisited connected components.
 *
 * @param {Graph} graph graph containing all connected components
 * @param {Vertex} startingVertex first vertex from which to perform a BFS
 */
export const breadthFirstSearchInit = async (graph, startingVertex) => {
  beforeAlgorithm()
  await breadthFirstSearch(startingVertex)

  for (let v of graph.vertices) {
    if (v.state === VERTEX_STATES.unexplored) {
      await breadthFirstSearch(v)
    }
  }
  afterAlgorithm()
}

/**
 * Performs a depth first search of the connected component
 * from a given starting vertex.
 *
 * @param {Vertex} startingVertex vertex to start the BFS from
 */
const breadthFirstSearch = async (startingVertex) => {
  /** List containing lists for each level. */
  let l = []

  /** List of level 0. */
  let l0 = []
  let i = 0

  startingVertex.state = VERTEX_STATES.explored

  drawVertex(startingVertex, COLORS.blue)
  drawVertexSubtext(startingVertex, 'Level: ' + i)
  await sleep()

  l0.push(startingVertex)
  l[0] = l0

  while (l[i].length > 0) {
    let liPlus1 = []
    l[i + 1] = liPlus1
    for (let v of l[i]) {
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
            drawVertexSubtext(w, 'Level: ' + (i + 1))
            await sleep()

            l[i + 1].push(w)
          } else {
            e.state = EDGE_STATES.crossEdge
            drawEdge(e, COLORS.yellow)
            await sleep()
          }
        }
      }
    }
    i++
  }
}

/**
 * Runs Dijkstra's algorithm.
 *
 * @param {Graph} Graph graph containing all connected components
 * @param {Vertex} startingVertex vertex to start Dijkstra's algorithm from
 */
export const dijkstrasAlgorithm = async (graph, startingVertex) => {}

/**
 * Runs before an algorithm starts running.
 */
const beforeAlgorithm = () => {
  state.algorithmIsRunning = true
}

/**
 * Runs after an algorithm has finished running.
 */
const afterAlgorithm = () => {
  state.algorithmIsRunning = false
}

/**
 * Returns a new Promise
 *
 * @returns
 */
const sleep = () => new Promise((resolve) => setTimeout(resolve, state.visualizationDelay))
