function TableModule(name, rows, columns) {
    let module = CreateEle('table')
    module.style["border-collapse"]="collapse"
    cellStyle = {border: "1px solid black"}
    module.tableName = name
    module.cellStyle = cellStyle

    module.columns = columns
    module.rows = rows
    let colgroup = CreateEle('colgroup')
    for (var i = 0; i < columns; i++) {
        colgroup.InsertEle(CreateEle('col'))
    }
    module.InsertEle(colgroup)
    for (let r = 0; r < rows; r++) {
        let row = CreateEle('tr')
        for (let c = 0; c < columns; c++) {
            row.InsertEle(TabelCellModule(name + ColumnIndexToLetter(c) + (r+1), cellStyle, false))
        }
        module.InsertEle(row)
    }

    module.Build = function(rows, columns) {
        this.Empty()
        this.columns = columns
        this.rows = rows
        let colgroup = CreateEle('colgroup')
        for (var i = 0; i < columns; i++) {
            colgroup.InsertEle(CreateEle('col'))
        }
        this.InsertEle(colgroup)
        for (let r = 0; r < rows; r++) {
            let row = CreateEle('tr')
            for (let c = 0; c < columns; c++) {
                row.InsertEle(TabelCellModule(this.tableName + ColumnIndexToLetter(c) + (r + 1), cellStyle, false))
            }
            this.InsertEle(row)
        }
    }

    module.GetCell = function(cell) {
        return module.querySelector('#'+this.tableName+cell)
    }

    module.AddRow = function() {
        let row = CreateEle('tr')
        for (let c = 0; c < this.columns; c++) {
            row.InsertEle(TabelCellModule(name + ColumnIndexToLetter(c) + (this.rows.length + 1), this.cellStyle, false))
        }
        this.InsertEle(row)
    }

    return module
}

function TabelCellModule(cellID, styles={}, readonly=true) {
    let module = CreateEle('td', {id:cellID})
    Object.keys(styles).forEach((key) => {
        module.style[key] = styles[key]
    })
    if (!readonly) {
        module.InsertEle(CreateEle('input', {id: cellID + "input", type:"text"}))
    }

    module.readonly = readonly
    module.SetValue = function(value) {
        if(this.readonly) {
            this.innerText = value
        } else {
            this.children[0].value = value
        }
    }

    return module
}

function ColumnIndexToLetter(index) {
    return String.fromCharCode(65 + index)
}
