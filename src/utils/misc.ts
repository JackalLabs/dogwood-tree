/**
 * Notify that function is deprecated and should no longer be used.
 * @param {string} thing - Name of deprecated item. Example: "[ParentContext] functionName()".
 * @param {string} version - First version with deprecated item. Example: "v1.1.1".
 * @param {{aggressive?: boolean, replacement?: string}} opts
 * - Aggressive: TRUE to trigger alert.
 * - Replacement: the function name that should be used instead. Example: "replacementFunction()".
 */
export function deprecated(
  thing: string,
  version: string,
  opts?: { aggressive?: boolean; replacement?: string },
) {
  let notice = `Dogwood | ${thing} is deprecated as of: ${version}`
  if (opts?.replacement) {
    notice += ` - Please use ${opts.replacement} instead`
  }
  console.error(notice)
  if (opts?.aggressive) alert(notice)
}

/**
 * Calculate the number of branches tree will contain.
 * @param {number} leaves - Number of source leaves in the tree.
 * @returns {number}
 */
export function calculateBranches(leaves: number): number {
  return Math.pow(2, Math.ceil(Math.log2(leaves)))
}

/**
 * Converts string to Uint8Array.
 * @param {string} str - String to convert.
 * @returns {Uint8Array} - Converted result.
 */
export function stringToUint8(str: string): Uint8Array {
  const uintView = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    uintView[i] = str.charCodeAt(i)
  }
  return uintView
}
