export enum Edge {
   Top,
   Bottom,
   Left,
   Right,
}
export enum Side {
   Left,
   Right,
}

export type DropdownPlacement_t = {
   triggerEdge: Edge
   expansionEdge: Edge
   expansionSide: Side
}

export type DropdownWidth_t = "min" | "max"
