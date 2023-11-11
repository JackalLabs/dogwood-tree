export interface IMultiProof {
  verify(data: Array<ArrayBuffer>): Promise<boolean>
}
