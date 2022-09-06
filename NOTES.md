# TODOS
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
- Save the state of the graph as soon as an algorithm is run.
- Clean up SCSS code.
- Responsiveness.
- Document code.
- Avoid global state.
- Maybe use Greek letters (because they look so cool).
## To Fix
- Restoring a graph to its initial state (before an algorithm is run)
    - `algorithmWasRun: Boolean` state property
        - if `false`, then do nothing and just return
        - else if `true`, then reset the grpah to its state before the algorithm was run
        and draw that graph to the canvas
