import type { TTypedArrays } from '@/types'

/**
 * Compares 2 ArrayBuffers and returns true if they are an exact match.
 * @param {ArrayBuffer} a - First ArrayBuffer to compare.
 * @param {ArrayBuffer} b - Second ArrayBuffer to compare.
 * @returns {boolean}
 */
export function arrayBuffersMatch(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) {
    return false
  } else {
    switch (0) {
      case a.byteLength % 4:
        return typedArraysMatch<Uint32Array>(new Uint32Array(a), new Uint32Array(b))
      case a.byteLength % 2:
        return typedArraysMatch<Uint16Array>(new Uint16Array(a), new Uint16Array(b))
      case a.byteLength % 1:
        return typedArraysMatch<Uint8Array>(new Uint8Array(a), new Uint8Array(b))
      default:
        throw new Error("Unexpected Result, bad math?")
    }
  }
}

/**
 * Compares 2 TypedArrays and returns true if they are an exact match.
 * @param {TTypedArrays} a - First TypedArray to compare.
 * @param {TTypedArrays} b - Second TypedArray to compare.
 * @returns {boolean}
 * @see {TTypedArrays}
 */
export function typedArraysMatch<T extends TTypedArrays>(a: T, b: T): boolean {
  if (a.byteLength !== b.byteLength) {
    return false
  } else {
    return a.every((val, i) => val === b[i])
  }
}
