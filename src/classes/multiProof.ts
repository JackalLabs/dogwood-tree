import type { IMultiProof } from '@/interfaces'

export class MultiProof implements IMultiProof {

  constructor () {
  }

  async verify(data: Array<ArrayBuffer>): Promise<boolean> {
    console.log(data)
    return false
  }
}
