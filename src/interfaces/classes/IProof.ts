export interface IProof {
  verify(data: ArrayBuffer): Promise<boolean>
}
