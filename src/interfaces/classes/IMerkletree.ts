export interface IMerkletree {
  getRoot(): ArrayBuffer
  getRootAsHex(): string
  getSalt(): boolean
  getPollard(height: number): Array<ArrayBuffer>
}
