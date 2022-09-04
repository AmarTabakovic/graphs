/**
 * Adds a vertex ID entry into the strating vertex dropdown menu.
 *
 * @param {Vertex} vertex vertex to add
 */
export const addVertexToStartVertexDropdown = (vertex) => {
  let startVertexSelect = document.getElementById('start-vertex-select')
  let option = document.createElement('option')
  option.value = option.innerHTML = vertex.id
  startVertexSelect.add(option)
}

/**
 * Clears the starting vertex dropdown menu.
 */
export const clearStartVertexDropdown = () => {
  let startVertexSelect = document.getElementById('start-vertex-select')
  while (startVertexSelect.options.length > 0) startVertexSelect.remove(0)
}
