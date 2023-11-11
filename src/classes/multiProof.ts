import { IMultiProof } from '@/interfaces'

export class MultiProof implements IMultiProof {

  constructor () {
  }

  async verify(data: Array<ArrayBuffer>): Promise<boolean> {
    return false
  }

}
