export default {
  width: 700,
  height: 700,

  logger: {
    quadtrees: false,
  },

  force: {
    attraction: {
      active: true,
      scalar: 0.001,
      idealDistance: 10,
    },
    repulsion: {
      active: true,
      scalar: 0.01,
    },
    center: {
      active: true,
      scalar: 0.0001,
    },
    drag: {
      active: true,
      scalar: 0.98,
    },
  },

  render: {
    background: {
      active: true,
      color: "#111111",
    },
    node: {
      display: true,
      color: "#A0A0A0",
      size: 2,
    },
    link: {
      display: true, color: "#666666",
      width: 1.0,
    },
    quadtree: {
      display: true,
      color: "#008000",
      width: 0.1,
    },
    velocity: {
      display: true,
      color: "#FF00FF",
      width: 1.0,
      scalar: 6,
      // width: 2.0,
      // scalar: 10,
    },
  },

  probe: {
    render: {
      display: true,
      color: "#FFFF00",
      size: 4,

      link: true,
      velocity: true,
    },
    force: {
      center: true,
      attract: true,
      repulsion: true,
      drag: true,
    },
  },

  quadtree: {
    capacity: 8,
    // capacity: 1,
  },

  nodes: {
    spawn: {
      active: true,
      count: 1000,
    },
    connect: {
      active: true,
      chance: 0.3,
      count: {
        min: 1,
        max: 4,
      },
    },
  },
} as const;
