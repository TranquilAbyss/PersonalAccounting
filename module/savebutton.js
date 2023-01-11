//uses <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
function SaveButtonModule(fileName, generateSaveString) {
    let module = CreateEle('button', {class: 'save-button',
                          innerText:'Save',
                          accept: 'application/json',
                          onclick: () => SaveToFileEvent(fileName, generateSaveString) })
    return module
}

function SaveToFileEvent(fileName, generateSaveString) {
    let fileContent = generateSaveString()
    let myFile = new File([fileContent], fileName, {type: "application/json"})
    saveAs(myFile)
}
