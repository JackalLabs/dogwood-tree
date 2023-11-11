// OneOf<T, V> is the main event:
// take a type T and a tuple type V, and return the type of
// T widened to relevant element(s) of V:
 export type OneOf<
  T,
  V extends any[],
  NK extends keyof V = Exclude<keyof V, keyof any[]>
> = { [K in NK]: T extends V[K] ? V[K] : never }[NK];
