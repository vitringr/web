export default {
  width: 800,
  height: 800,

  force: {
    attraction: 0.01,
    repulsion: 1,
    center: 1,
  },

  render: {
    backgroundColor: "#111111",

    node: {
      display: true,
      color: "#A0A0A0",
      size: 7,
    },

    link: {
      display: true,
      color: "#555555",
      width: 0.5,
    },

    quadtree: {
      display: false,
      color: "#006020",
      width: 0.5,
    },
  },

  quadtree: {
    capacity: 1,
  },

  nodes: {
    count: 100,

    randomConnections: {
      chance: 0.3,
      count: {
        min: 1,
        max: 4,
      },
    },
  },
} as const;
