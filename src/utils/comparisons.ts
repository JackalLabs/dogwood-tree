import { TTypedArrays } from '@/types'

export function arrayBuffersMatch(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) {
    return false
  } else {
    switch (0) {
      case a.byteLength % 4:
        return typedArraysMatch(new Uint32Array(a), new Uint32Array(b))
      case a.byteLength % 2:
        return typedArraysMatch(new Uint16Array(a), new Uint16Array(b))
      case a.byteLength % 1:
        return typedArraysMatch(new Uint8Array(a), new Uint8Array(b))
      default:
        throw new Error("Unexpected Result, bad math?")
    }
  }
}

export function typedArraysMatch<T extends TTypedArrays>(a: T, b: T): boolean {
  if (a.byteLength !== b.byteLength) {
    return false
  } else {
    return a.every((val, i) => val === b[i])
  }
}
