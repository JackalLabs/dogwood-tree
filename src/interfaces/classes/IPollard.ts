/**
 * @interface IPollard
 * @desc - Merkletree Pollard.
 * @since 1.0.0
 *
 * @prop {getHashes} getHashes
 * @prop {getHeight} getHeight
 * @prop {getLength} getLength
 * @prop {verify} verify
 */
export interface IPollard {

  /**
   * @method getHashes
   * @desc - Get hashes in pollard.
   * @returns {Array<ArrayBuffer>}
   */
  getHashes(): Array<ArrayBuffer>

  /**
   * @method getHeight
   * @desc - Get height in parent merkletree of this pollard.
   * @returns {number}
   */
  getHeight(): number

  /**
   * @method getLength
   * @desc - Get number of hashes in pollard.
   * @returns {number}
   */
  getLength(): number

  /**
   * @method verify
   * @desc - Async check if this is a valid merkletree pollard.
   * @returns {Promise<boolean>}
   */
  verify(): Promise<boolean>
}
