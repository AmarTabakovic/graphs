# TODOS
- Separate vertex/edge insertion and drawing.
    - `insertEdge(properties...)` and `insertVertex(properties...)` inserts a new vertex/edge
    into the vertex/edge list and returns the reference of the newly created vertex/edge object.
    - `drawEdge(edge: Edge, edgeColor: String, transitionType: TRANSITION_TYPE)` and 
    `drawVertex(vertex: vertex: vertexColor: String, transitionType: TRANSITION_TYPE)` 
    draws an vertex/edge to the canvas using an existing vertex/edge object.
        - Vertex object: 
        ```js
        {
            id: Number, 
            xPos: Number, 
            yPos: Number, 
            incomingEdges: List<Edge>,
            outgoingEdges: List<Edge>,
        }
        ```
        - Edge object:
        ```js
        {
            vertex0: Vertex,
            vertex1: Vertex,
            isDirected: Boolean,
            weight: Number
        }
        ```
        - For drawing edges, the edge `x0`, `y0`, `x1`, `y1` positions can be determined from 
        the `vertex0.xPos`, `vertex0.yPos`, `vertex1.xPos`, `vertex1.yPos` properties.
    - Transition types:
        - `none`: Draws the vertex/edge without any effects.
        - `fade`: Draws the vertex/edge fading in.
        - `twoPointFade`: Mainly intended for edge highlighting. Draws the edge fading in from vertex0 to vertex1.
    - Transitions can be implemented using callback functions which are passed into the drawing methods.
- Implement timer for animating the algorithms using `async`.
    - See the *Sorts* project as a reference.
- Save the state of the graph as soon as an algorithm is run.
- Implement starting vertex dropdown list in the sidebar.
- Add a second text field in vertex for displaying the level during BFS or the value during Dijkstra's algorithm.

