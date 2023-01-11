
let header
let toolbar
let content

let title = "Personal Budget"

const MONTHSINYEAR = 12
const WEEKSINYEAR = 52
const dollarUSLocale = Intl.NumberFormat('en-US');
let currencyDeliminator = ","
let yearlyEstimatedIncome = Observer(0)
let accounts = Observer([])
let categories = Observer([])
let transactions = Observer([])
let budget = Observer([])
let accountTotals = Observer([])
let homeDiv
let transactionsDiv
let budgetDiv
let accountsDiv

function LoadScripts() {
    LoadScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js")
    LoadScript("module/table.js")
    LoadScript("module/savebutton.js")
    LoadScript("module/loadfilebutton.js")
    LoadScript("module/datatable.js")
}

LoadScripts()

window.onload = function() {
    SetupCoreHMTL()

    SetupNotice()
    SetupToolBar()
    SetupContent()

    //inputs - estimated yearly income, transactions, categories, categories estimates, financial acoounts and totals

    // write file content
    // var myFile = new File(["CONTENT"], "demo.txt", {type: "text/plain;charset=utf-8"});
    // saveAs(myFile);

    //Budget
    //Yearly Transactions
    //Fincial accounts
    //Categories
    //Categories Mappers

    //possible setup subscribe functionality for tables and data.
    //
    //     Check if js can overide assign operator.
    // Setup Observables
}

function SetupCoreHMTL() {
    document.title = title
    header = CreateEle('div', {id:"header", innerText:title})
    notice = CreateEle('div', {id:"notice"})
    toolbar = CreateEle('div', {id:"toolbar"})
    content = CreateEle('div', {id:"content"})

    InsertEles(document.body, [header, notice, toolbar, content])
}

function SetupContent() {
    homeDiv = HomePageModule()
    transactionsDiv = TransactionsModule()
    budgetDiv = BudgetModule()
    accountsDiv = AccountsModule()

    content.InsertEle(homeDiv);
    content.InsertEle(transactionsDiv);
    content.InsertEle(budgetDiv);
    content.InsertEle(accountsDiv);
}

function SetupNotice() {
    toolbar.InsertEles([CreateEle('p',{innerText: 'Remember to save before refreshing or closing page'})])
}

function SetupToolBar() {
    toolbar.InsertEles([CreateEle('button', {innerText: 'home', onclick: ShowHomePage}),
                        CreateEle('span', {innerText: '|'}),
                        CreateEle('button', {innerText: 'accounts', onclick: ShowAccountsPage}),
                        CreateEle('span', {innerText: '|'}),
                        CreateEle('button', {innerText: 'transactions', onclick: ShowTransactionsPage}),
                        CreateEle('span', {innerText: '|'}),
                        CreateEle('button', {innerText: 'budget', onclick: ShowBudgetPage}),
                      ])
}

function HomePageModule() {
    let module = CreateEle('div', {id:"home"})
    module.InsertEle(CreateEle('h1', {innerText: "Home"}))
    module.InsertEle(CreateEle('h2', {innerText: "Description"}))
    module.InsertEle(CreateEle('p', {innerText: "This tool helps budgeting by orgianizing mutliple sources of money into catagories with their own blances. Using categories with balances can help with purchancing decissions throughout the year. This is done by Categorizing the Transations throughout the year"}))
    module.InsertEle(CreateEle('p', {innerText: "Tabs:"}))
    module.InsertEle(CreateEle('p', {innerText: "Accounts - The list of financial and category accounts and their blances."}))
    module.InsertEle(CreateEle('p', {innerText: "Transactions - The transactions either bank or cash that you want to track and categorize with your budget."}))
    module.InsertEle(CreateEle('p', {innerText: "Budget - Helps you plan your estimate spending for the budget period."}))
    module.InsertEle(CreateEle('h2', {innerText: "Load and Save"}))
    module.InsertEle(LoadFileButtonModule(LoadFromFileJson))
    module.InsertEle(SaveButtonModule("PersonalBudgetSave.json", GenerateSaveString))
    return module
}

function TransactionsModule() {
    tableHeaders = [{name:"date", displayName: "Date"},
                   {name:"category", displayName: "Category"},
                   {name:"description", displayName: "Description"},
                   {name:"value", displayName: "Value"},
                   {name:"bankDescription", displayName: "Bank Description"}]

    let module = CreateEle('div', {id:"transactions"})
    module.style.display="none"
    module.InsertEle(CreateEle('h1', {innerText: "Transactions"}))
    module.InsertEle(CreateEle('h2', {innerText: "New Transactions Import"}))
    module.InsertEle(CreateEle('p', {innerText: "Go to bank's transaction history page and click printer icon. Copy and paste the table into box below."}))
    module.InsertEle(CreateEle('textarea', {id:"newtransactions", oninput:NewTransactionOnInput}))
    // TODO Ignore a transaction rule
    module.InsertEle(CreateEle('h2', {innerText: "Transactions"}))
    module.InsertEle(CreateEle('p', {innerText: "Transactions can be added or updated"}))
    let table = DataTableModule("Tran", transactions, tableHeaders)
    transactions.Subscribe((data) => table.LoadData(data))
    // TODO remove a transaction row
    module.InsertEle(table)
    return module
}

function BudgetModule() {
    let module = CreateEle('div', {id:"budget"})
    module.style.display="none"
    module.InsertEle(CreateEle('h1', {innerText: "Budget"}))
    module.InsertEle(CreateEle('span', {innerText: "Yearly Income "}))
    let input = CreateEle('input', {type:"text", onchange: SetYearlyIncome, value: 0})
    yearlyEstimatedIncome.Subscribe((data) => {input.value = dollarUSLocale.format(data)})
    module.InsertEle(input)
    module.InsertEle(CreateEle('br'))
    let table = DataTableModule("Bud", budget, [{name:"gross%", displayName: "Gross %"},
                                                {name:"categories", displayName: "Categories"},
                                                {name:"net%", displayName: "Net %"},
                                                {name:"weekly", displayName: "Weekly"},
                                                {name:"monthly", displayName: "Monthly"},
                                                {name:"year", displayName: "Year"}])
    budget.Subscribe((data) => table.LoadData(data))
    module.InsertEle(table)
    return module
}

function AccountsModule() {
    let module = CreateEle('div', {id:"accounts", style:'display="none"'})
    module.style.display="none"
    module.InsertEle(CreateEle('h1', {innerText: "Accounts"}))
    module.InsertEle(CreateEle('p', {innerText: "List of accounts or money sources (ex. Cash) and budget Categories to split money up into."}))
    module.InsertEle(CreateEle('h2', {innerText: "Financial Accounts"}))
    module.InsertEle(CreateEle('p', {innerText: "List easily accessable (Liquid) sources of money and each accounts current balances."}))
    let finTable = DataTableModule("FinAcct", accounts, [{name:"name", displayName: "Name"}, {name:"total", displayName: "Total"}])
    accounts.Subscribe((data) => finTable.LoadData(data))
    module.InsertEle(finTable)
    module.InsertEle(CreateEle('h2', {innerText: "Categories Accounts"}))
    module.InsertEle(CreateEle('p', {innerText: "Categories in your budget and their balance will automaticly update from transactions"}))
    let catTable = DataTableModule("Cat", categories, [{name:"name", displayName: "Name"}, {name:"total", displayName: "Total"}])
    categories.Subscribe((data) => catTable.LoadData(data))
    transactions.Subscribe(() => UpdateCategoryTotal(() => categories.Publish()))
    categories.Subscribe(() => UpdateCategoryTotal((data) => catTable.LoadData(data)))
    module.InsertEle(catTable)
    module.InsertEle(CreateEle('h2', {innerText: "Totals Check"}))
    module.InsertEle(CreateEle('p', {innerText: "Automaticly updates to compare financial accounts totals with budgeted categories totals. Can be used to find mistakes in transactions"}))
    let totalTable = DataTableModule("Tot", accountTotals, [{name:"name", displayName: "Name"}, {name:"total", displayName: "Total"}])
    accounts.Subscribe(() => UpdateAccountTotal((data) => totalTable.LoadData(data)))
    categories.Subscribe(() => UpdateAccountTotal((data) => totalTable.LoadData(data)))
    module.InsertEle(totalTable)

    return module
}

function UpdateAccountTotal(lambda) {
    let fin = 0
    let cat = 0
    let check = 0
    let data = []
    accounts.data.forEach((account) => {
        fin += Number(account.total)
    })

    categories.data.forEach((category) => {
        cat += Number(category.total)
    })

    diff = fin - cat
    
    data = [{name: "Financials", total: fin },{name: "Categories", total: cat},{name: "Difference", total: diff}]

    lambda(data)
}

function UpdateCategoryTotal(lambda) {
    categories.data.forEach((category) => {
        category.total = 0
    })
    if (categories.data.length > 0) {
        let category
        transactions.data.forEach((transaction) => {
            category = categories.data.find(c => c.name === transaction.category)
            if (typeof category != 'undefined') {
                if (!isNaN(transaction.value)) {
                    category.total += Number(transaction.value)
                } else {
                    console.warn(transaction.date +" "+ transaction.bankDescription + " value is not a number");
                }
            }
        })
        lambda(categories.data)
    }
}

function LoadFromFileJson(text) {
    json = JSON.parse(text)
    yearlyEstimatedIncome.Update(json.yearlyEstimatedIncome)
    accounts.Update(json.accounts)
    categories.Update(json.categories)
    transactions.Update(json.transactions)
    budget.Update(json.budget)
}

function GenerateSaveString() {
    json = {
        yearlyEstimatedIncome: yearlyEstimatedIncome.data,
        categories: categories.data,
        accounts: accounts.data,
        transactions: transactions.data,
        budget: budget.data
    }

    text = JSON.stringify(json)

    return text
}

function ShowHomePage() {
    HideAllPages()
    homeDiv.style.display = "block"
}

function ShowTransactionsPage() {
    HideAllPages()
    transactionsDiv.style.display = "block"
}

function ShowBudgetPage() {
    HideAllPages()
    budgetDiv.style.display = "block"
}

function ShowAccountsPage() {
    HideAllPages()
    accountsDiv.style.display = "block"
}

function HideAllPages() {
    document.getElementById("home").style.display = "none"
    document.getElementById("transactions").style.display = "none"
    document.getElementById("budget").style.display = "none"
    document.getElementById("accounts").style.display = "none"
}

function NewTransactionOnInput(event) {
    let text = event.target.value.trim()
    let list = text.split("\n")
    list.forEach((line, index) => {
        let records = line.split("\t")
        if (records.length == 6) {
            let value = "-" + records[3].replaceAll(currencyDeliminator, "")
            if (isNaN(value)) value = records[4].replaceAll(currencyDeliminator, "")

            let transaction = CreateTransaction(records[0], records[2], value)
            if (transaction != null) {
                let find = transactions.data.find((trans) => { return trans.CompareTransaction(transaction) })
                if(find == undefined) {
                    transactions.data.push(transaction)
                 }
             }
        }
    })
    transactions.Update(transactions.data)
}

function SetYearlyIncome(event) {
    text = event.target.value

    text = text.replaceAll(currencyDeliminator, "")
    if (!isNaN(text)) {
        yearlyEstimatedIncome.Update(text)
        event.target.value = dollarUSLocale.format(text)
    } else {
        console.warn("Yearly Income value entered is not a number: " + text );
    }
}

function CreateTransaction(date, bankDescription, value) {
    let valid = true
    if (isNaN(Date.parse(date))) valid = false

    if (typeof value == "string") value = value.replace(",", "")
    if (isNaN(value)) valid = false

    if (valid) {
        return {
            date: date,
            bankDescription: bankDescription,
            value: value,
            category: "",
            description: "",
            CompareTransaction: function(transaction) {
                return this.date == transaction.date &&
                    this.bankDescription == transaction.bankDescription &&
                    this.value == transaction.value
            }
        }
    } else {
        console.log("Transaction is not valid: " + date + " " + bankDescription + " " + value)
        return null
    }
}
