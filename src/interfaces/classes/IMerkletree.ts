import { IPollard, IProof } from '@/interfaces/classes'

export interface IMerkletree {
  getRoot(): ArrayBuffer
  getRootAsHex(): string
  getSalt(): boolean

  generatePollard(height: number): IPollard
  generateProof(data: ArrayBuffer, height: number): IProof
}
