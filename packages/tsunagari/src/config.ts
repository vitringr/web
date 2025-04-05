export default {
  width: 650,
  height: 660,

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
      scalar: 0.04,
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
      targetColor: "#FFFF00",
      size: 12,
    },
    link: {
      display: true,
      color: "#666666",
      targetColor: "#FFFF00",
      width: 4.0,
    },
    quadtree: {
      display: true,
      color: "#008000",
      width: 0.5,
    },
    velocity: {
      display: true,
      color: "#FF00FF",
      width: 1.0,
      scalar: 10,
    },
  },

  quadtree: {
    capacity: 10,
  },

  nodes: {
    spawn: {
      active: true,
      count: 200,
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
