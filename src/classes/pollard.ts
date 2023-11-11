import { IPollard } from '@/interfaces/classes'
import { branchHashOptions } from '@/utils/hash'
import { arrayBuffersMatch } from '@/utils/comparisons'

export class Pollard implements IPollard {
  protected readonly hashes: Array<ArrayBuffer>
  protected readonly hashType: string
  protected readonly height: number

  constructor (hashes: Array<ArrayBuffer>, hashType: string, height: number) {
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
