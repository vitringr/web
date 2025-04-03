export default {
  width: 600,
  height: 600,

  force: {
    attraction: {
      active: false,
      scalar: 0.1,
      idealDistance: 100,
    },
    repulsion: {
      active: true,
      scalar: 1,
    },
    center: {
      active: false,
      scalar: 0.005,
    },
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
      display: true,
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
