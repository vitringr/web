FIX:
  Fix the padding on hex grid fills.

  Fix bidirectional diagonal squares.

FEATURES:
  Hover cell debug:
    - Maybe keybind press to console current cell.
    - Will fix some bugs.

  Full drawing control.
  
  Automatic design:
    (requires full drawing control)
    Automatically start (or restart) the pathfinder
    after the end of a draw (or delete). This makes
    additional controls unnecessary.

  Configurable User Interface.

  Scrollable timeline.

  Hexagons Improvements:
    Choose between pointy-top and flat-top hexagons.
    Cube coordinate distances instead of euclidean.

  Path Visualization:
    If the flags are fixed, can visualize the current
    path only, using the path flag, and when the path
    changes, have an array that remembers the current
    path, remove the path flags and redraw the cells
    that are no longer a path, but they do keep their
    other states (like open, closed) as well.

  Gradient Terrain:
    Instead of a terrain flag (arguable), have every
    cell be able to be terrain, just by the T cost.
    Increase the color like a gradient depending on
    how costly the terrain is. Noise function to make
    the terrain look more realistic.

  Consider porting to WebGL.
    - Delegate stuff to the GPU if possible.
