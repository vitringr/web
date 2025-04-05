export default {
  width: 790,
  height: 790,

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
      color: "#909090",
      radius: 7,
    },
    connection: {
      display: true,
      color: "#666666",
      width: 3.0,
    },
    quadtree: {
      display: false,
      color: "#008000",
      width: 0.5,
    },
    velocity: {
      display: false,
      color: "#FF00FF",
      width: 1.0,
      scalar: 10,
    },
    target: {
      node: "#FFFF00",
      connected: "#FFFF00",
      connection: "#FFFF00",
    }
  },

  quadtree: {
    capacity: 10,
  },

  nodes: {
    spawn: {
      active: true,
      count: 300,
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
