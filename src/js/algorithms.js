import { clearCanvas, COLORS, drawEdge, drawGraph, drawVertex, drawVertexSubtext } from './canvas'
import { EDGE_STATES } from './edge'
import { state } from './state'
import { VERTEX_STATES } from './vertex'

/**
 * Initializes a depth first search from a given starting vertex and
 * traverses any subsequent unvisited connected components.
 *
 * @param {Graph} graph graph containing all connected components
 * @param {Vertex} startingVertex first vertex from which to perform a DFS
 */
const depthFirstSearchInit = async (graph, startingVertex) => {
  beforeAlgorithm(graph)
  await depthFirstSearch(startingVertex)
  for (const v of graph.vertices) {
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

  for (const e of startingVertex.outgoingEdges) {
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
const breadthFirstSearchInit = async (graph, startingVertex) => {
  beforeAlgorithm(graph)
  await breadthFirstSearch(startingVertex)

  for (const v of graph.vertices) {
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
  const l = []

  /** List of level 0. */
  const l0 = []
  let i = 0

  startingVertex.state = VERTEX_STATES.explored

  drawVertex(startingVertex, COLORS.blue)
  drawVertexSubtext(startingVertex, 'Level: ' + i)
  await sleep()

  l0.push(startingVertex)
  l[0] = l0

  while (l[i].length > 0) {
    const liPlus1 = []
    l[i + 1] = liPlus1
    for (const v of l[i]) {
      for (const e of v.outgoingEdges) {
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
 * Performs Dijkstra's algorithm of the connected component
 * from a given starting vertex.
 *
 * @param {Graph} Graph graph containing all connected components
 * @param {Vertex} startingVertex vertex to start Dijkstra's algorithm from
 */
const dijkstrasAlgorithm = async (graph, startingVertex) => {
  beforeAlgorithm(graph)

  /** Weight labels. */
  const d = []
  d[startingVertex.id] = 0

  for (const u of graph.vertices) {
    if (u != startingVertex) d[u.id] = Infinity
    let distanceStr = d[u.id] == Infinity ? '\u221E' : '0'
    drawVertexSubtext(graph.vertices[u.id], 'Distance: ' + distanceStr)
  }

  /** Simulating the priority queue using an array. */
  const q = []

  for (const u of graph.vertices) {
    /** Key: Vertex ID, Value: Vertex distance */
    q[u.id] = d[u.id]
  }

  startingVertex.state = VERTEX_STATES.explored
  drawVertex(startingVertex, COLORS.blue)
  drawVertexSubtext(startingVertex, 'Distance: 0')
  await sleep()

  let qLen = q.length

  while (qLen > 0) {
    /**
     * removeMin() but in linear time instead of logarithmic time.
     *
     * TODO: Implement this with a priority queue.
     */
    let minKey = 0
    let minValue = Infinity
    for (const [key, value] of q.entries()) {
      if (value < minValue) {
        minKey = key
        minValue = value
      }
    }
    const u = graph.vertices[minKey]
    q[minKey] = undefined
    qLen--

    u.state = VERTEX_STATES.explored
    drawVertex(u, COLORS.blue)
    drawVertexSubtext(u, 'Distance: ' + d[u.id])
    await sleep()

    for (const e of u.outgoingEdges) {
      let z
      if (e.vertex0 == u) z = e.vertex1
      else if (e.vertex1 == u) z = e.vertex0
      if (e.state != EDGE_STATES.relaxed) {
        drawEdge(e, COLORS.yellow)
        await sleep()
      }

      /** Relaxation procedure. */
      if (d[u.id] + e.weight < d[z.id]) {
        d[z.id] = d[u.id] + e.weight
        drawEdge(e, COLORS.green)
        e.state = EDGE_STATES.relaxed
        await sleep()
        drawVertex(z, COLORS.green)
        drawVertexSubtext(z, 'Distance: ' + d[z.id])
        await sleep()
        drawVertex(z, COLORS.white)
        drawVertexSubtext(z, 'Distance: ' + d[z.id])
        await sleep()
        q[z.id] = d[z.id]
      }
    }
  }
  afterAlgorithm()
}

/**
 * Runs before an algorithm starts running.
 *
 * @param {Graph} graph graph to run an algorithm on
 */
const beforeAlgorithm = (graph) => {
  graph.reset()
  clearCanvas()
  drawGraph(graph)
  state.algorithmIsRunning = true
}

/**
 * Runs after an algorithm has finished running.
 */
const afterAlgorithm = () => {
  state.algorithmIsRunning = false
}

/**
 * Sleep function for visualizations.
 *
 * @returns promise
 */
const sleep = () => new Promise((resolve) => setTimeout(resolve, state.visualizationDelay))

export { breadthFirstSearchInit, depthFirstSearchInit, dijkstrasAlgorithm }
