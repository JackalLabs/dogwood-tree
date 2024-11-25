import type {IPollard, IProof} from '@/interfaces/classes'

/**
 * @interface IMerkletree
 * @desc - Merkletree Proving Structure.
 * @since 1.0.0
 *
 * @prop {getRoot} getRoot
 * @prop {getRootAsHex} getRootAsHex
 * @prop {getSalt} getSalt
 * @prop {generatePollard} generatePollard
 * @prop {generateProof} generateProof
 */
export interface IMerkletree {
  /**
   * @method getRoot
   * @desc - Get raw merkletree root node.
   * @returns {ArrayBuffer}
   */
  getRoot(): ArrayBuffer

  /**
   * @method getRootAsHex
   * @desc - Get merkletree root node as hex encoding.
   * @returns {string}
   */
  getRootAsHex(): string

  /**
   * @method getSalt
   * @desc - Check if salt was used in creating merkletree.
   * @returns {boolean}
   */
  getSalt(): boolean

  /**
   * @method generatePollard
   * @desc - Generate IPollard instance from merkletree.
   * @param {number} height - Height to use for creating pollard.
   * @returns {IPollard}
   */
  generatePollard(height: number): IPollard

  /**
   * @method generateProof
   * @desc - Generate IProof instance from merkletree.
   * @param {ArrayBuffer} data - ArrayBuffer to check for comparison.
   * @param {number} height - Height to use for creating internal pollard.
   * @returns {IProof}
   */
  generateProof(data: ArrayBuffer, height: number): IProof
}
