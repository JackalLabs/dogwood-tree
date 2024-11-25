import type {TBranchHashOptionKeys} from '@/types'

/**
 * @interface IMerkletreeSource
 * @desc - Merkletree creation parameters.
 * @since 1.0.0
 *
 * @prop {ArrayBuffer} [seed] - Raw ArrayBuffer to use default pre-processing.
 * @prop {Array<ArrayBuffer>} [sapling] - Prepared array of ArrayBuffers.
 * @prop {number} [chunkSize] - Chunk size to use with seed.
 * @prop {string} [hashType] - Tag of hashing type to use, currently only supports SHA3_512.
 * @prop {boolean} [useSalt] - If merkletree should be salted, not yet implemented.
 * @prop {boolean} [sort] - If merkletree should be sorted, not yet implemented.
 * @prop {boolean} [preserve] - If merkletree should preserve full tree or only final root.
 */
export interface IMerkletreeSource {
  seed?: ArrayBuffer
  sapling?: Array<ArrayBuffer>
  chunkSize?: number
  hashType?: TBranchHashOptionKeys
  useSalt?: boolean
  sort?: boolean
  preserve?: boolean
}
