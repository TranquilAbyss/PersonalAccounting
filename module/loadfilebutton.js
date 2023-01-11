function LoadFileButtonModule(loadFromFile, post = []) {
    let module = CreateEle('input', { type: 'file',
         class: 'file-selector',
         accept: 'application/json',
         onchange: () => WaitForFileReader(event, loadFromFile) } )
    return module
}

async function WaitForFileReader(event, output) {
    let text = await readFile(event.target.files[0])
    output(text)
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.onload = () => {
      resolve(fr.result)
    }
    fr.onerror = reject
    return fr.readAsText(file)
  })
}
