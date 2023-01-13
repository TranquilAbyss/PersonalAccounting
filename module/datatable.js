function DataTableModule(name, observer, columns = []) {
    //Datatable columns {names, displayname, readonly}, dataset
    let module = TableModule(name, 2, columns.length)
    module.observer = observer
    module.columnObjects = columns
    //columns headers
    columns.forEach((column, c) => {
        let cell = module.GetCell(ColumnIndexToLetter(c) + 1)
        let columnHeader = column["name"]
        if (typeof column["displayName"] !== 'undefined') {
            columnHeader = column["displayName"]
        }
        cell.SetValue(columnHeader)

        //setup intail cells
        cell = module.GetCell(ColumnIndexToLetter(c) + 2)
        SetupDataCell(cell, 0, column)

    })
    //intial load data cells
    let row = 2
    observer.data.forEach((object, index) => {
        module.AddRow()
        columns.forEach((column, c) => {
            let cell = module.GetCell(ColumnIndexToLetter(c) + row)
            let newCell = module.GetCell(ColumnIndexToLetter(c) + (row + 1))
            let dataValue = object[column["name"]]
            if (typeof  dataValue == 'undefined') {
                dataValue = ""
            }
            cell.SetValue(dataValue)
            if (!cell.readonly) {
                cell.children[0].oninput = OnCellChange
                cell.children[0].onchange = OnCellChange
            }

            //setup next cells
            SetupDataCell(newCell, index + 1, column)
        })
        ++row
    })

    module.LoadData = function(data, force = false) {
        if (!force && document.activeElement.id.includes(this.tableName)) {
            return
        }
        columns = this.columnObjects
        this.Build(2, columns.length)

        //columns headers
        columns.forEach((column, c) => {
            let cell = this.GetCell(ColumnIndexToLetter(c) + 1)
            let columnHeader = column["name"]
            if (typeof column["displayName"] !== 'undefined') {
                columnHeader = column["displayName"]
            }
            cell.SetValue(columnHeader)

            //setup intail cells
            cell = this.GetCell(ColumnIndexToLetter(c) + 2)
            SetupDataCell(cell, 0, column)

        })
        //intial load data cells
        let row = 2
        data.forEach((object, index) => {
            module.AddRow()
            columns.forEach((column, c) => {
                let cell = this.GetCell(ColumnIndexToLetter(c) + row)
                let newCell = this.GetCell(ColumnIndexToLetter(c) + (row + 1))
                let dataValue = object[column["name"]]
                if (typeof dataValue == 'undefined') {
                    dataValue = ""
                }
                cell.SetValue(dataValue)
                if (!cell.readonly) {
                    cell.children[0].oninput = OnCellChange
                    cell.children[0].onchange = OnCellChange
                }

                //setup next cells
                SetupDataCell(newCell, index + 1, column)
            })
            ++row
        })
    }
    return module
}

function SetupDataCell(cell, index, column) {
    cell.index = index
    cell.column = column
    if (!cell.readonly) {
        cell.children[0].oninput = OnCellChange
        cell.children[0].onchange = OnCellChange
    }
}

function OnCellChange(event) {
    let cell = event.target.offsetParent
    let table = event.target.offsetParent.offsetParent
    let observer = table.observer
    let newData = observer.data
    if (typeof observer.data[cell.index] == "undefined") {
        newData.push({})
        // Add row if last row is empty
        table.AddRow()
        table.columnObjects.forEach((column, c) => {
            let newCell = table.GetCell(ColumnIndexToLetter(c) + (newData.length + 2))

            SetupDataCell(newCell, newData.length, column)
        })
    }
    newData[cell.index][cell.column["name"]] = event.srcElement.value
    observer.Update(newData)
}
