import traverse from 'traverse'

/** Recursively removes undefined, null, empty arrays, and empty objects without mutating the original data. */
function sanitizeData<T>(incomingData: T): T {
  const data = traverse(incomingData).clone()
  traverse(data).forEach(function () {
    this.before(function (node) {
      if (this.key === 'richText') this.update(node, true) // Do Not Sanitize Children Of Rich Text
    })
    this.after(function (node) {
      if (
        node === undefined ||
        node === null ||
        (Array.isArray(node) && node.length === 0) ||
        (typeof node === 'object' && !Array.isArray(node) && Object.keys(node).length === 0)
      ) {
        this.remove()
      }
    })
  })
  return data
}

export default sanitizeData
