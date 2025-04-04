import { Structures } from "@utilities/structures";

export namespace Logger {
  export function clear() {
    console.clear();
  }

  export function quadtrees(quadtree: Structures.Quadtree<any, any>) {
    let count: number = 0;
    quadtree.rootRecursion(() => {
      count++;
    });
    console.log("QUADTREES: " + count);
  }
}
