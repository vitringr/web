export default {
  width: 800,
  height: 800,

  logger: {
    quadtrees: false,
  },

  force: {
    attraction: {
      active: true,
      scalar: 0.01,
      idealDistance: 100,
    },
    repulsion: {
      active: false,
      scalar: 0.01,
    },
    center: {
      active: false,
      scalar: 0.01,
    },
    drag: {
      active: true,
      scalar: 0.98,
    },

    probe: {
      center: false,
    },
  },

  render: {
    backgroundColor: "#111111",

    node: {
      display: true,
      color: "#A0A0A0",
      size: 3,
    },
    link: {
      display: true,
      color: "#666666",
      width: 0.5,
    },
    quadtree: {
      display: true,
      color: "#006020",
      width: 0.2,
    },
    velocity: {
      display: true,
      color: "#FF00FF",
      width: 1.5,
      scalar: 6,
    },

    probe: {
      display: true,
      color: "#FFFF00",
      size: 3,

      link: {
        display: true,
        color: "#555555",
        width: 0.5,
      },
      velocity: {
        display: true,
        color: "#FF00FF",
        width: 1.5,
        scalar: 5,
      },
    },
  },

  quadtree: {
    capacity: 8,
  },

  nodes: {
    count: 1000,
    randomConnections: {
      chance: 0.3,
      count: {
        min: 1,
        max: 4,
      },
    },
  },
} as const;
