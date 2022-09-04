import { state } from './state'
import { EDGE_STATES, VERTEX_STATES, COLORS } from './constants'
import { drawEdge, drawVertex, drawVertexLevel } from './canvas'

/**
 *
 */
export const depthFirstSearchInit = async (startingVertex) => {
  beforeAlgorithm()
  await depthFirstSearch(startingVertex)
  for (let v of state.vertices) {
    if (v.state === VERTEX_STATES.unexplored) await depthFirstSearch(v)
  }
  afterAlgorithm()
}

/**
 *
 * @param {*} startingVertex
 */
const depthFirstSearch = async (startingVertex) => {
  startingVertex.state = VERTEX_STATES.explored

  drawVertex(startingVertex, COLORS.blue)
  await sleep()

  for (let e of startingVertex.outgoingEdges) {
    if (e.state === EDGE_STATES.unexplored) {
      /** Opposite edge from the starting vertex */
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
 *
 * TODO: Fix
 *
 * @param {*} startingVertex
 */
export const breadthFirstSearchInit = async (startingVertex) => {
  beforeAlgorithm()
  await breadthFirstSearch(startingVertex)
  for (let v of state.vertices) {
    if (v.state === VERTEX_STATES.unexplored) {
      await breadthFirstSearch(v)
    }
  }
  afterAlgorithm()
}

/**
 *
 * @param {*} startingVertex
 */
const breadthFirstSearch = async (startingVertex) => {
  let l = []
  let l0 = []
  let i = 0

  startingVertex.state = VERTEX_STATES.explored

  drawVertex(startingVertex, COLORS.blue)
  drawVertexLevel(startingVertex, i)
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
            drawVertexLevel(w, i + 1)
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

export const dijkstrasAlgorithm = async (startingVertex) => {}

/**
 *
 */
const beforeAlgorithm = () => {
  state.algorithmIsRunning = true
}

/**
 *
 */
const afterAlgorithm = () => {
  state.algorithmIsRunning = false
}

/**
 *
 * @returns
 */
const sleep = () => new Promise((resolve) => setTimeout(resolve, state.visualizationSpeed))
