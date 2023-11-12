import { branchHashOptions } from '@/utils/hash'
import { arrayBuffersMatch } from '@/utils/comparisons'
import type { IPollard, IProof } from '@/interfaces/classes'

export class Proof implements IProof {
  protected readonly hashes: Array<ArrayBuffer>
  protected readonly index: number
  protected readonly hashType: string
  protected readonly salted: boolean
  protected readonly pollard: IPollard

  constructor (h: Array<ArrayBuffer>, i: number, t: string, s: boolean, p: IPollard) {
    this.hashes = h
    this.index = i
    this.hashType = t
    this.salted = s
    this.pollard = p
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
    for (let i = 0, ii = ind; i < this.hashes.length; i++, ii >>=1) {
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
