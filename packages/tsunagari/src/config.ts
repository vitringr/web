export default {
  width: 800,
  height: 800,

  render: {
    backgroundColor: "#111111",

    node: {
      color: "#999999",
      size: 4,
    },

    link: {
      color: "#444444",
      width: 0.4,
    },

    quadtree: {
      color: "#006020",
      width: 1,
    },
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
        max: 5,
      },
    },
  },
} as const;
