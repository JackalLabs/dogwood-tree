/**
 * @interface IMerkletreeCompact
 * @desc - Memory efficient Merkletree Hashing Structure.
 * @since 1.1.0
 *
 * @prop {getRoot} getRoot
 * @prop {getRootAsHex} getRootAsHex
 */
export interface IMerkletreeCompact {
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
}
