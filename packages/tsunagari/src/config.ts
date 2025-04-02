export default {
  width: 800,
  height: 800,

  render: {
    backgroundColor: "#111111",

    nodeColor: "#999999",
    nodeSize: 3,

    linkColor: "#444444",
    linkWidth: 0.5,
  },

  quadtree: {
    capacity: 4,
  },

  nodes: {
    count: 300,

    randomConnections: {
      chance: 50,
      count: {
        min: 1,
        max: 10,
      },
    },
  },
} as const;
