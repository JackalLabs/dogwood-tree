export interface IHashFunctionOptions {
  // [key: string]: ((a: ArrayBuffer) => ArrayBuffer) | ((a: ArrayBuffer) => Promise<ArrayBuffer>)
  [key: string]: (a: ArrayBuffer) => ArrayBuffer
}
