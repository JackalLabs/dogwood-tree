import { describe, expect, test } from 'vitest'
import { stringToUint8 } from '@/utils/misc'

describe('Miscellaneous Functions', () => {
  test('stringToUint8 should convert string to Uint8Array', () => {
    const testStr = 'Hello'
    const testArr = [72, 101, 108, 108, 111]
    const uint = stringToUint8(testStr)
    expect(Array.from(uint)).toEqual(testArr)
    expect(uint.buffer.byteLength).toBe(5)
  })
})
