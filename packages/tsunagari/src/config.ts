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
      idealDistance: 40,
    },
    repulsion: {
      active: true,
      scalar: 1.0,
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
      display: true,
      color: "#666666",
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
    },
  },

  probe: {
    render: {
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
    force: {
      center: false,
      attract: false,
      repulsion: false,
    },
  },

  quadtree: {
    capacity: 8,
  },

  nodes: {
    spawn: {
      active: true,
      count: 2000,
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
