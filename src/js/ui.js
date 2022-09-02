/**
 * 
 */
export const clearStartVertexDropdown = () => {
  let startEdgeSelect = document.getElementById('start-edge-select')
  while (startEdgeSelect.options.length > 0) startEdgeSelect.remove(0)
}

/**
 * 
 * @param {*} vertex 
 */
export const addVertexToStartVertexDropdown = (vertex) => {
  let startEdgeSelect = document.getElementById('start-edge-select')
  let option = document.createElement('option')
  option.value = option.innerHTML = vertex.id
  startEdgeSelect.add(option)
}
