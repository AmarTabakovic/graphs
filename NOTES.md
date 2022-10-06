# Long-Term Goals 
- Animations
    - `insertEdge(properties...)` and `insertVertex(properties...)` inserts a new vertex/edge
    into the vertex/edge list and returns the reference of the newly created vertex/edge object.
    - `drawEdge(edge: Edge, edgeColor: String, transitionType: TRANSITION_TYPE)` and 
    `drawVertex(vertex: vertex: vertexColor: String, transitionType: TRANSITION_TYPE)` 
    draws an vertex/edge to the canvas using an existing vertex/edge object.
    - Transition types:
        - `none`: Draws the vertex/edge without any effects.
        - `fade`: Draws the vertex/edge fading in.
        - `twoPointFade`: Mainly intended for edge highlighting. Draws the edge fading in from vertex0 to vertex1.
    - Transitions can be implemented using callback functions which are passed into the drawing methods.
- Clean up SCSS code.
- Maybe use Greek letters (because they look so cool).
- Implement some more algorithms:
	- For example:
		- Kruskal's algorithm
		- Prim-Jarnik algorithm
		- Floyd-Warshall algorithm
	- If a grpah doesn't meet the requirements for an algorithm (e.g. negative cycle), display error message using `alert()`.
- Fix Dijkstra's algorithm visualization (currently doesn't visualize relaxed edges properly)
