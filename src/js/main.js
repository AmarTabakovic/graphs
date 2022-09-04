import { CANVAS_X_OFFSET } from './constants'
import { handleCanvasClick } from './canvas'
import { depthFirstSearchInit, breadthFirstSearchInit, dijkstrasAlgorithm } from './algorithms'
import { clearCanvas } from './canvas'
import { state, resetState } from './state'
import { clearStartVertexDropdown } from './ui'

/**
 *
 */
export const init = () => {
  /** Initializing edge canvas */
  let edgeCanvas = document.getElementById('edge-canvas')
  edgeCanvas.height = window.innerHeight
  edgeCanvas.width = window.innerWidth - CANVAS_X_OFFSET

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
  vertexCanvas.width = window.innerWidth - CANVAS_X_OFFSET

  let vertexContext = vertexCanvas.getContext('2d')
  state.vertexContext = vertexContext

  /** Initializing DFS button event handler. */
  document.getElementById('dfs-button').addEventListener('click', () => {
    /** Do not do anything if an algorithm is already running. */
    if (state.algorithmIsRunning) return

    let select = document.getElementById('start-vertex-select')
    let option = select.options[select.selectedIndex].value

    depthFirstSearchInit(state.vertices[option])
  })

  /** Initializing BFS button event handler. */
  document.getElementById('bfs-button').addEventListener('click', () => {
    /** Do not do anything if an algorithm is already running. */
    if (state.algorithmIsRunning) return

    let select = document.getElementById('start-vertex-select')
    let option = select.options[select.selectedIndex].value

    breadthFirstSearchInit(state.vertices[option])
  })

  /** Initializing Dijkstra's algorithm button event handler. */
  // document.getElementById('dijkstras-button').addEventListener('click', () => {
  /** Do not do anything if an algorithm is already running. */
  /* if (state.algorithmIsRunning) return

    let select = document.getElementById('start-vertex-select')
    let option = select.options[select.selectedIndex].value
    
    dijkstrasAlgorithm(state.vertices[option])
  }) */

  /** Initializing visualization speed slider. */
  let slider = document.getElementById('speed-slider')
  const sliderMax = 1000
  slider.min = 10
  slider.max = sliderMax
  slider.value = sliderMax - state.visualizationSpeed
  slider.addEventListener('input', () => {
    state.speed = sliderMax - slider.value
  })

  /** Initializing initial graph button. TODO: Implement */
  // document.getElementById('initial-button').addEventListener('click', () => {
  /** Do not do anything if an algorithm is already running. */
  // if (state.algorithmIsRunning) return
  /**
   * 1. Set the graph state to be before the algorithm was run.
   * 2. Clear the canvas.
   * 3. Render the graph using drawGraph().
   */
  // })

  /** Initializing clear screen button. */
  document.getElementById('clear-button').addEventListener('click', () => {
    clearCanvas()
    clearStartVertexDropdown()
    resetState()
  })

  /** Setting disclaimer text. */
  document.getElementById('disclaimer').innerText = new Date().getFullYear() + ' Amar Tabakovic'
}
