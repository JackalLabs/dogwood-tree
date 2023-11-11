export interface IPollard {
  getHashes(): Array<ArrayBuffer>
  getHeight(): number
  getLength(): number
  verify(): Promise<boolean>
}
