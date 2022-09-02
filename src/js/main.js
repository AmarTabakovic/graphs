import { state } from './state'
import * as constants from './constants'
import { handleCanvasClick } from './canvas'
import { depthFirstSearchInit, breadthFirstSearchInit } from './algorithms'
import { clearCanvas } from './canvas'
import { resetState } from './state'
import { clearStartVertexDropdown } from './ui'

/**
 *
 */
export const init = () => {
  /** Initializing edge canvas */
  let edgeCanvas = document.getElementById('edge-canvas')
  edgeCanvas.height = window.innerHeight
  edgeCanvas.width = window.innerWidth - constants.CANVAS_X_OFFSET

  let edgeContext = edgeCanvas.getContext('2d')
  state.edgeContext = edgeContext

  /**
   * Use the edge canvas (which lies on top of the vertex canvas)
   * to catch and handle click events.
   */
  edgeCanvas.addEventListener('click', handleCanvasClick)

  /** Initializing vertex canvas */
  let vertexCanvas = document.getElementById('vertex-canvas')
  vertexCanvas.height = window.innerHeight
  vertexCanvas.width = window.innerWidth - constants.CANVAS_X_OFFSET

  let vertexContext = vertexCanvas.getContext('2d')
  state.vertexContext = vertexContext

  /** Initializing DFS button event handler. */
  document.getElementById('dfs-button').addEventListener('click', () => {
    /** Do not do anything if an algorithm is already running. */
    if (state.algorithmIsRunning) return

    let select = document.getElementById('start-edge-select')
    let option = select.options[select.selectedIndex].value
    depthFirstSearchInit(state.vertices[option])
  })

  /** Initializing BFS button event handler. */
  document.getElementById('bfs-button').addEventListener('click', () => {
    /** Do not do anything if an algorithm is already running. */
    if (state.algorithmIsRunning) return

    let select = document.getElementById('start-edge-select')
    let option = select.options[select.selectedIndex].value
    breadthFirstSearchInit(state.vertices[option])
  })

  /** Initializing initial graph button. TODO: Fix */
  document.getElementById('initial-button').addEventListener('click', () => {
    /** Do not do anything if an algorithm is already running. */
    if (state.algorithmIsRunning) return

    clearCanvas()
  })

  /** Initializing clear screen button. */
  document.getElementById('clear-button').addEventListener('click', () => {
    clearCanvas()
    clearStartVertexDropdown()
    resetState()
  })

  /** Setting disclaimer text. */
  document.getElementById('disclaimer').innerText = new Date().getFullYear() + ' Amar Tabakovic'
}
