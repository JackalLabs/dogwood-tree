export interface IMerkletreeSource {
  seed?: ArrayBuffer
  sapling?: Array<ArrayBuffer>
  chunkSize?: number
  hashType?: string
  useSalt?: boolean
  sort?: boolean
  preserve?: boolean
}
