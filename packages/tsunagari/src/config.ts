export default {
  width: 700,
  height: 700,

  log: {
    quadtrees: false,
    displayedNodes: false,
  },

  force: {
    center: {
      active: true,
      scalar: 0.0001,
    },
    repulsion: {
      active: true,
      scalar: 0.02,
    },
    attraction: {
      active: true,
      scalar: 0.00001,
      idealDistance: 40,
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
      size: 4,
    },
    link: {
      display: true,
      color: "#666666",
      width: 2.0,
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
      scalar: 10,
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
    capacity: 10,
  },

  nodes: {
    spawn: {
      active: true,
      count: 500,
    },
    connect: {
      active: true,
      chance: 0.5,
      count: {
        min: 1,
        max: 3,
      },
    },
  },
} as const;
