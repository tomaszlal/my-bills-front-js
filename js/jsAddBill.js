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
    let fieldAmount = document.getElementById("amount");
    let amount = fieldAmount.value;
    amount = amount.replace(/,/g, '.');
    amount = amount.replace(/[^0-9\\.]+/g, '');
    // amount = amount.replace(/\D+/g, "");  
    let tableOfAmount = amount.split(".");
    console.log(tableOfAmount);
    if (tableOfAmount.length == 1 || (tableOfAmount.length == 2 && tableOfAmount[1].length < 3)) {
        isCorrectlyFieldAmount = true;
        amountOk = amount;
    }
    fieldAmount.value = amountOk;
    validateFormFields()
}

//sprawdzenie wybrania kategorii
function validateCategoryField() {
    let fieldCategory = document.getElementById("selectCategory");
    console.log(fieldCategory.value);
    if (fieldCategory.value > 0) {
        isCorrectlyFieldCategory = true;
    } else {
        isCorrectlyFieldCategory = false;
    }
    console.log(isCorrectlyFieldCategory);
    validateFormFields();
}

//sprawdzenie wpisania do pola formularz nr faktry minimum 5 znaków
function validateInvoiceField() {
    let invoiceField = document.getElementById("invoiceNumber").value;
    if (invoiceField.length > 5) {
        isCorrectlyFieldInvoiceNumer = true;
    } else {
        isCorrectlyFieldInvoiceNumer = false;
    }
    console.log(isCorrectlyFieldInvoiceNumer);
    validateFormFields();
}

//sprawdzenie wprowadzenia daty wystawienia rachynku
function validateDateOfIssueField() {
    let dateOfIssueField = document.getElementById("dateOfIssue").value;
    console.log(dateOfIssueField);
    let year = dateOfIssueField.split("-")[0];
    if (year > 2000) {
        isCorrectlyFieldDateOfIssue = true;
    } else {
        isCorrectlyFieldDateOfIssue = false;
    }

    //validateFormFields();
    validateDateOfPaymentField();
}

//sprawdzenie wprowadzenia daty terminu płatności zapłaty za rachunek
function validateDateOfPaymentField() {
    let dateOfIssueField = document.getElementById("dateOfIssue").value;
    let dateOfPaymentField = document.getElementById("dateOfPayment").value;


    let year = dateOfPaymentField.split("-")[0];
    if (year > 2000 && dateOfPaymentField > dateOfIssueField) {
        isCorrectlyFieldDateOfPayment = true;
        console.log("data wieksza")
    } else {
        isCorrectlyFieldDateOfPayment = false;
    }
    validateFormFields();
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


//funkcja wysylajaca do API rachunek 
async function saveBillInDb() {
    let select = document.getElementById("selectCategory");
    let billToInsert = {
        "id": null,
        "category":{
            "id": select.value
        },
        "invoiceNumber":document.getElementById("invoiceNumber").value,
        "amount":document.getElementById("amount").value,
        "dateOfIssue":document.getElementById("dateOfIssue").value,
        "dueDate":null,
        "dateOfPayment":document.getElementById("dateOfPayment").value,
        "wasPaid":false
    }
    await fetch(apiUrl+'/bills', {
        method: "POST",
        headers: {
            'Content-Type': "application/json;charset=UTF-8"
        },
        body: JSON.stringify(billToInsert)
    }).then(res => res.json().then(data => {
        console.log(data);
        location.replace("index.html");

    }));
}
