import {branchHashOptions} from '@/utils/hash'
import {arrayBuffersMatch} from '@/utils/comparisons'
import type {IPollard, IProof} from '@/interfaces/classes'
import type {TBranchHashOptionKeys} from '@/types'

/**
 * @class Proof
 * @desc - Merkletree Proof.
 * @see {IProof}
 */
export class Proof implements IProof {
  protected readonly hashes: Array<ArrayBuffer>
  protected readonly index: number
  protected readonly hashType: TBranchHashOptionKeys
  protected readonly salted: boolean
  protected readonly pollard: IPollard

  /**
   * @constructor Proof
   * @param {Array<ArrayBuffer>} hashes - Merkletree hashes.
   * @param {number} index - Merkletree index.
   * @param {TBranchHashOptionKeys} hashType - Merkletree hash type used.
   * @param {boolean} salted - If merkletree was salted.
   * @param {IPollard} pollard - Pollard instance to use as source.
   */
  constructor(
    hashes: Array<ArrayBuffer>,
    index: number,
    hashType: TBranchHashOptionKeys,
    salted: boolean,
    pollard: IPollard,
  ) {
    this.hashes = hashes
    this.index = index
    this.hashType = hashType
    this.salted = salted
    this.pollard = pollard
  }

  async verify(data: ArrayBuffer): Promise<boolean> {
    const hashFunc = branchHashOptions[this.hashType]
    let proofHash = new ArrayBuffer(0)
    if (this.salted) {
      // not implemented
    } else {
      proofHash = hashFunc(data)
    }

    const ind = this.index + (1 << this.hashes.length)
    for (let i = 0, ii = ind; i < this.hashes.length; i++, ii >>= 1) {
      if (ii % 2 === 0) {
        const concat = await new Blob([proofHash, this.hashes[i]]).arrayBuffer()
        proofHash = hashFunc(concat)
      } else {
        const concat = await new Blob([this.hashes[i], proofHash]).arrayBuffer()
        proofHash = hashFunc(concat)
      }
    }

    const pHashes = this.pollard.getHashes()
    for (let i = 0; i < pHashes.length / 2 + 1; i++) {
      if (arrayBuffersMatch(pHashes[pHashes.length - 1 - i], proofHash)) {
        return true
      }
    }
    return false
  }
}
