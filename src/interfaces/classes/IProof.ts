/**
 * @interface IProof
 * @desc - Merkletree Proof.
 * @since 1.0.0
 *
 * @prop {verify} verify
 */
export interface IProof {

  /**
   * @method verify
   * @desc - Async check if ArrayBuffer is present in merkletree.
   * @param {ArrayBuffer} data - ArrayBuffer to check for comparison.
   * @returns {Promise<boolean>}
   */
  verify(data: ArrayBuffer): Promise<boolean>
}
