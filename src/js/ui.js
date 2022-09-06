/**
 * Adds a vertex ID entry into the strating vertex dropdown menu.
 *
 * @param {Vertex} vertex vertex to add
 */
const addVertexToStartVertexDropdown = (vertex) => {
  const startVertexSelect = document.getElementById('start-vertex-select')
  const option = document.createElement('option')
  option.value = option.innerHTML = vertex.id
  startVertexSelect.add(option)
}

/**
 * Clears the starting vertex dropdown menu.
 */
const clearStartVertexDropdown = () => {
  const startVertexSelect = document.getElementById('start-vertex-select')
  while (startVertexSelect.options.length > 0) startVertexSelect.remove(0)
}

export { addVertexToStartVertexDropdown, clearStartVertexDropdown }
