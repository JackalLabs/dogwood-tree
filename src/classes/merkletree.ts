import {Pollard, Proof} from '@/classes'
import {calculateBranches, stringToUint8} from '@/utils/misc'
import {branchHashOptions, bufferToHex} from '@/utils/hash'
import {arrayBuffersMatch} from '@/utils/comparisons'
import type {IMerkletreeCompact, IMerkletreeCompactSource, IMerkletreeSource} from '@/interfaces'
import type {IMerkletree, IPollard, IProof} from '@/interfaces/classes'
import type {TBranchHashOptionKeys} from '@/types'

/**
 * @class Merkletree
 * @desc - Merkletree instance.
 * @see {IMerkletree}
 */
export class Merkletree implements IMerkletree {
  protected readonly root: ArrayBuffer
  protected readonly source: Array<ArrayBuffer>
  protected readonly nodes: Array<ArrayBuffer>
  protected readonly hash: TBranchHashOptionKeys
  protected readonly salted: boolean
  protected readonly sorted: boolean

  /**
   * @constructor Merkletree
   * @protected
   */
  protected constructor(
    r: ArrayBuffer,
    p: boolean,
    sap: Array<ArrayBuffer>,
    n: Array<ArrayBuffer>,
    h: TBranchHashOptionKeys,
    u: boolean,
    s: boolean,
  ) {
    this.root = r
    this.source = p ? sap : []
    this.nodes = p ? n : []
    this.hash = h
    this.salted = u
    this.sorted = s
  }

  /**
   * @constructor Merkletree
   * @param {IMerkletreeSource} input - Merkletree creation parameters.
   * @returns {Promise<IMerkletree>}
   */
  static async grow(input: IMerkletreeSource): Promise<IMerkletree> {
    let {
      seed,
      sapling,
      chunkSize,
      hashType = 'sha3_512',
      useSalt = false,
      sort = false,
      preserve = true,
    } = input

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

    return new Merkletree(
      nodes[1],
      preserve,
      sapling,
      nodes,
      hashType,
      useSalt,
      sort,
    )
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

  generatePollard(height: number): IPollard {
    if (this.nodes.length === 0) {
      throw new Error('Data was not preserved!')
    } else {
      return new Pollard(
        this.nodes.slice(1, Math.pow(2, height + 1)),
        this.hash,
        height,
      )
    }
  }

  generateProof(data: ArrayBuffer, height: number): IProof {
    if (this.nodes.length === 0) {
      throw new Error('Data was not preserved!')
    } else {
      const index = indexOf(data, this.source)
      if (index === -1) {
        throw new Error('Data is not present!')
      } else {
        const proofLen = Math.ceil(Math.log2(this.source.length)) - height
        const hashes: Array<ArrayBuffer> = Array(proofLen).fill(
          new ArrayBuffer(64),
        )

        const it = index + this.nodes.length / 2
        const limit = Math.pow(2, height + 1) - 1
        for (let i = it, ii = 0; i > limit; i /= 2, ii++) {
          hashes[ii] = this.nodes[i ^ 1]
        }
        return new Proof(
          hashes,
          index,
          this.hash,
          this.salted,
          this.generatePollard(height),
        )
      }
    }
  }
}

/**
 * @class MerkletreeCompact
 * @desc - Merkletree Compact instance.
 * @see {IMerkletreeCompact}
 */
export class MerkletreeCompact implements IMerkletreeCompact {
  protected readonly root: ArrayBuffer

  /**
   * @constructor MerkletreeCompact
   * @protected
   */
  protected constructor(r: ArrayBuffer) {
    this.root = r
  }

  /**
   * @constructor MerkletreeCompact
   * @param {IMerkletreeCompactSource} input - Merkletree Compact creation parameters.
   * @returns {Promise<IMerkletreeCompact>}
   */
  static async grow(
    input: IMerkletreeCompactSource,
  ): Promise<IMerkletreeCompact> {
    let { seed, sapling, chunkSize, hashType = 'sha3_512' } = input

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
    let queue = Array(branchesLen).fill(new ArrayBuffer(64))
    for (let i = 0; i < sapling.length; i++) {
      queue[i] = hashFunc(sapling[i])
    }
    while (queue.length > 1) {
      const cycle = []
      for (let i = queue.length - 1; i >= 0; i--) {
        cycle[i] = merkle(queue[i * 2], queue[i * 2 + 1], hashFunc)
      }
      queue = cycle
    }

    return new MerkletreeCompact(queue[0])
  }

  getRoot(): ArrayBuffer {
    return this.root
  }

  getRootAsHex(): string {
    return bufferToHex(this.root)
  }
}

function merkle(
  left: ArrayBuffer,
  right: ArrayBuffer,
  hashFunc: any,
): ArrayBuffer {
  const length = left.byteLength + right.byteLength
  const final = new Uint8Array(length)
  const uLeft = new Uint8Array(left)
  const uRight = new Uint8Array(right)
  final.set(uLeft, 0)
  final.set(uRight, left.byteLength)
  return hashFunc(final)
}

function indexOf(needle: ArrayBuffer, haystack: Array<ArrayBuffer>): number {
  for (let i = 0; i < haystack.length; i++) {
    if (arrayBuffersMatch(needle, haystack[i])) {
      return i
    }
  }
  return -1
}
