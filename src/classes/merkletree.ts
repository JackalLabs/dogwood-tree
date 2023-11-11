import { sha3_512 } from 'js-sha3'

import { IMerkletree } from '@/interfaces/classes'
import { IMerkletreeSource } from '@/interfaces/IMerkletreeSource'
import { calculateBranches, stringToUint8 } from '@/utils/misc'
import { branchHashOptions, bufferToHex } from '@/utils/hash'

export class Merkletree implements IMerkletree {
  protected readonly root: ArrayBuffer
  protected readonly source: Array<ArrayBuffer>
  protected readonly nodes: Array<ArrayBuffer>
  protected readonly hash: string
  protected readonly salted: boolean
  protected readonly sorted: boolean

  protected constructor(r: ArrayBuffer, p: boolean, sap: Array<ArrayBuffer>, n: Array<ArrayBuffer>, h: string, u: boolean, s: boolean) {
    this.root = r
    this.source = p ? sap : []
    this.nodes = p ? n : []
    this.hash = h
    this.salted = u
    this.sorted = s
  }

  static async grow(input: IMerkletreeSource): Promise<IMerkletree> {
    let { seed, sapling, chunkSize, hashType = 'sha3_512', useSalt = false, sort = false, preserve = true } = input

    if (sapling) {
      // do nothing
    } else if (seed && chunkSize) {
      sapling = []
      for (let i = 0, ii = 0; i < seed.byteLength; i += chunkSize, ii++) {
        const bufChunk = seed.slice(i, i + chunkSize)
        const str = ii.toString() + bufferToHex(bufChunk)
        const hashName = await crypto.subtle.digest(
          'SHA-256',
          stringToUint8(str),
        )
        sapling.push(hashName)
      }
    } else {
      throw new Error('No Data Provided!')
    }

    if (!Object.keys(branchHashOptions).includes(hashType)) {
      throw new Error(`Unsupported hashType of "${hashType}"!`)
    }
    const hashFunc = branchHashOptions[hashType]

    const branchesLen = calculateBranches(sapling.length)
    const nodeLen =
      branchesLen + sapling.length + (branchesLen - sapling.length)
    const nodes: Array<ArrayBuffer> = Array(nodeLen).fill(new ArrayBuffer(64))

    for (let i = 0; i < sapling.length; i++) {
      nodes[branchesLen + i] = hashFunc(sapling[i])
    }

    for (let i = branchesLen - 1; i > 0; i--) {
      const left = nodes[i * 2]
      const right = nodes[i * 2 + 1]
      const concat = await new Blob([left, right]).arrayBuffer()
      nodes[i] = hashFunc(concat)
    }

    return new Merkletree(nodes[1], preserve, sapling, nodes, hashType, useSalt, sort)
  }

  getRoot(): ArrayBuffer {
    return this.root
  }
  getRootAsHex(): string {
    return bufferToHex(this.root)
  }
  getSalt(): boolean {
    return this.salted
  }
  getPollard(height: number): Array<ArrayBuffer> {
    if (this.nodes.length === 0) {
      throw new Error('Data was not preserved!')
    } else {
      return this.nodes.slice(1, Math.pow(2, height + 1))
    }
  }
}
