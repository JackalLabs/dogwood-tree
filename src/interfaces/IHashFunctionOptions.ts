/**
 * @interface IHashFunctionOptions
 * @desc - Merkletree hashing options.
 * @since 1.0.0
 *
 * @prop {function} sha3_512 - Hashes using SHA3-512.
 */
export interface IHashFunctionOptions {
  // [key: string]: ((a: ArrayBuffer) => ArrayBuffer) | ((a: ArrayBuffer) => Promise<ArrayBuffer>)
  blake3: (a: ArrayBuffer) => ArrayBuffer
  sha3_512: (a: ArrayBuffer) => ArrayBuffer
}
