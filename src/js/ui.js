/**
 * 
 */
export const clearStartVertexDropdown = () => {
  let startVertexSelect = document.getElementById('start-vertex-select')
  while (startVertexSelect.options.length > 0) startVertexSelect.remove(0)
}

/**
 * 
 * @param {*} vertex 
 */
export const addVertexToStartVertexDropdown = (vertex) => {
  let startVertexSelect = document.getElementById('start-vertex-select')
  let option = document.createElement('option')
  option.value = option.innerHTML = vertex.id
  startVertexSelect.add(option)
}
