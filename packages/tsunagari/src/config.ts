export default {
  width: 980,
  height: 980,

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
      scalar: 0.045,
    },
    attraction: {
      active: true,
      scalar: 0.00001,
      idealDistance: 45,
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
      radius: 8,
    },
    connection: {
      display: true,
      color: "#808080AA",
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
      node: "#FFCC11",
      connected: "#FFCC11",
      connection: "#FFBB11",
    },
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
