import type {TBranchHashOptionKeys} from '@/types'

/**
 * @interface IMerkletreeCompactSource
 * @desc - Memory efficient Merkletree creation parameters.
 * @since 1.1.0
 *
 * @prop {File} [raw] - Raw File source to use default pre-processing.
 * @prop {ArrayBuffer} [seed] - Raw ArrayBuffer to use default pre-processing.
 * @prop {Array<ArrayBuffer>} [sapling] - Prepared array of ArrayBuffers.
 * @prop {number} [chunkSize] - Chunk size to use with seed.
 * @prop {string} [hashType] - Tag of hashing type to use, currently only supports SHA3_512.
 */
export interface IMerkletreeCompactSource {
  raw?: File
  seed?: ArrayBuffer
  sapling?: Array<ArrayBuffer>
  chunkSize?: number
  hashType?: TBranchHashOptionKeys
}
