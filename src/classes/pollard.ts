import { branchHashOptions } from '@/utils/hash'
import { arrayBuffersMatch } from '@/utils/comparisons'
import type { IPollard } from '@/interfaces/classes'
import type { TBranchHashOptionKeys } from '@/types'

/**
 * @class Pollard
 * @desc - Merkletree Pollard.
 * @see {IPollard}
 */
export class Pollard implements IPollard {
  protected readonly hashes: Array<ArrayBuffer>
  protected readonly hashType: TBranchHashOptionKeys
  protected readonly height: number

  /**
   * @constructor Pollard
   * @param {Array<ArrayBuffer>} hashes - Merkletree hashes.
   * @param {TBranchHashOptionKeys} hashType - Merkletree hash type used.
   * @param {number} height - Height in Merkletree.
   */
  constructor (hashes: Array<ArrayBuffer>, hashType: TBranchHashOptionKeys, height: number) {
    this.hashes = hashes
    this.hashType = hashType
    this.height = height
  }

  getHashes(): Array<ArrayBuffer> {
    return this.hashes
  }
  getHeight(): number {
    return this.height
  }
  getLength(): number {
    return this.hashes.length
  }
  async verify(): Promise<boolean> {
    if (this.hashes.length === 1) {
      return true
    } else {
      const hashFunc = branchHashOptions[this.hashType]
      for (let i = this.hashes.length / 2 - 1; i >= 0; i--) {
        const left = this.hashes[i * 2 + 1]
        const right = this.hashes[i * 2 + 2]
        const concat = await new Blob([left, right]).arrayBuffer()
        if(!arrayBuffersMatch(this.hashes[i], hashFunc(concat))) {
          return false
        } else {
          // continue
        }
      }
      return true
    }
  }
}
