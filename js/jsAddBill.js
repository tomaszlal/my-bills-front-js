const apiUrl = "http://" + location.hostname + ":8080";

document.addEventListener("load", startWeb());


//funkcja uruchamiająca się po załadowniu strony
function startWeb() {
    getCategoryToSelect();


}


//funkcja pobiera categotie wydatków i umiescza w select
async function getCategoryToSelect() {
    let obj;
    await fetch(apiUrl + '/category')
        .then(res => res.json())
        .then(data => obj = data);
    // console.log(obj.length);
    let select = document.getElementsByTagName("select");
    obj.forEach(element => {
        insertCategoryToSelect(element, select, 0, false);


    });
}


//wstawia do selecta kategorię czyszcząc poprzednią listę
//nrSelect który select z koleji na stronie
function insertCategoryToSelect(element, select, nrSelect, selected) {
    let option = document.createElement("option");
    option.setAttribute('value', element.id);
    if (selected) option.selected = true;
    option.innerHTML = element.name;
    select[nrSelect].appendChild(option);

}

let isCorrectlyFieldAmount = false;
let isCorrectlyFieldCategory = false;
let isCorrectlyFieldInvoiceNumer = false;
let isCorrectlyFieldDateOfIssue = false;
let isCorrectlyFieldDateOfPayment = false;

// sprawdzenie i wprowadzenie kwoty w okienko
let amountOk = "";
function validateAmountField() {
    let fiieldAmount = document.getElementById("amount");
    let amount = fiieldAmount.value;
    amount = amount.replace(/,/g, '.');
    amount = amount.replace(/[^0-9\\.]+/g, '');
    // amount = amount.replace(/\D+/g, "");  
    let tableOfAmount = amount.split(".");
    console.log(tableOfAmount);
    if (tableOfAmount.length == 1 || (tableOfAmount.length == 2 && tableOfAmount[1].length < 3)) {
        isCorrectlyFieldAmount = true;
        amountOk =  amount;
    }
    fiieldAmount.value = amountOk;
    validateFormFields()
}

//sprawdzenie wybrania kategorii
function validateCategoryField() {
    
}

// włączenie przycisku dodaj rachunek
function enableButAddBill(enable) {
    document.getElementById("buttonAddBill").disabled = !enable;
}

//funkcja sprawdza czy wszystkie pola formularza poprawnie wypełnione i włącza lub wyłącza button
function validateFormFields() {
    if (isCorrectlyFieldAmount && isCorrectlyFieldCategory && isCorrectlyFieldInvoiceNumer && isCorrectlyFieldDateOfIssue && isCorrectlyFieldDateOfPayment) {
        enableButAddBill(true);
    } else {
        enableButAddBill(false);
    }
}