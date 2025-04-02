export default {
  FPS: 60,

  width: 800,
  height: 800,

  render: {
    backgroundColor: "#111111",

    nodeColor: "#999999",
    nodeSize: 4,

    linkColor: "#444444",
    linkWidth: 0.4,
  },

  quadtree: {
    capacity: 4,
  },

  nodes: {
    count: 500,

    randomConnections: {
      chance: 50,
      count: {
        min: 1,
        max: 5,
      },
    },
  },
} as const;
