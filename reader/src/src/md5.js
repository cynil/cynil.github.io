import md5 from 'md5'

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export function md5sum(file) {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = function(e) {
      const buffer = e.target.result
      resolve(md5(new Uint8Array(buffer)))
    }
    
    reader.readAsArrayBuffer(file)
  })
}