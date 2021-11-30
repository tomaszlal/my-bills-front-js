const apiUrl = "http://" + location.hostname + ":8080";

document.addEventListener("load", startWeb());


//zmienna globalno który rachunek usunąć
let idBillContext = 0;

let tableBillsConst = new Array();
let tableBills = new Array();

//funkcja uruchamiająca się po załadowniu strony
function startWeb() {
    getCategoryToSelect();
    getBills();

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


//wstawia do selecta kategorię
//nrSelect który select z koleji na stronie
function insertCategoryToSelect(element, select, nrSelect, selected) {
    let option = document.createElement("option");
    option.setAttribute('value', element.id);
    if (selected) option.selected = true;
    option.innerHTML = element.name;
    select[nrSelect].appendChild(option);

}

//funkcja pobiera categotie wydatków i umiescza w tabeli
async function getBills() {
    let obj;
    await fetch(apiUrl + '/bill')
        .then(res => res.json())
        .then(data => obj = data);
    // console.log(obj.length);

    obj.forEach(element => {
        //insertBillToTab(element, tbody);
        tableBills.push(element);
    });
    tableBillsConst = tableBills;
    getBillsAndFillTable()
}




function getBillsAndFillTable() {

    let tbody = document.getElementById("tbody");
    fillTable(tbody, tableBills);
}

//wypełnieni tabeli obiektem tabliaBills
function fillTable(tbody, table) {

    table.forEach(bill => {
        insertBillToTab(bill, tbody);
    });
}

//wstawia do tabeli pojedyńczy element
function insertBillToTab(element, tbody) {
    let tr = document.createElement("tr");
    tr.setAttribute('id', element.id);
    tbody.appendChild(tr);
    let dataToTd = new Array(8);
    dataToTd[0] = element.category.name;
    dataToTd[1] = element.invoiceNumber;
    dataToTd[2] = element.dateOfIssue;
    dataToTd[3] = element.dateOfPayment;
    dataToTd[4] = element.amount + " zł";
    dataToTd[5] = element.dueDate;
    if (element.wasPaid) dataToTd[6] = "TAK";
    else dataToTd[6] = "NIE";
    let i = 0;
    dataToTd.forEach(tdData => {
        let td = document.createElement("td");
        td.innerHTML = tdData;
        td.setAttribute("class", document.getElementsByTagName("th")[i].className);
        //if (i == 0) td.id = element.category.id; //chyba nie potrzebne
        if (i == 4) td.className = td.className + " text-end";
        i++;
        tr.appendChild(td);
    });
    let td = document.createElement("td");

    //wstawienie ikony kosza
    let imgTrash = document.createElement("img");
    imgTrash.setAttribute("src", "icons_web/trash-2.svg");
    imgTrash.className = "m-1";
    imgTrash.setAttribute("data-bs-toggle", "modal");
    imgTrash.setAttribute("data-bs-target", "#delBillModal");
    imgTrash.setAttribute("alt", "Usuń");
    imgTrash.setAttribute("data-toogle", "tooltip");
    imgTrash.setAttribute("title", "Usuń rachunek");
    imgTrash.setAttribute("onclick", "idBillToDelete(this.parentNode.parentNode)");
    td.appendChild(imgTrash);

    //wstawienie ikony oko
    let imgShow = document.createElement("img");
    imgShow.setAttribute("src", "icons_web/eye.svg");
    imgShow.className = "m-1";
    imgShow.setAttribute("data-bs-toggle", "modal");
    imgShow.setAttribute("data-bs-target", "#showBillModal");
    imgShow.setAttribute("alt", "Zobacz");
    imgShow.setAttribute("data-toogle", "tooltip");
    imgShow.setAttribute("title", "Podgląd rachunku");
    imgShow.setAttribute("onclick", "idBillToShow(this.parentNode.parentNode)")
    td.appendChild(imgShow);


    //wstawienie ikony edycja
    let imgEdit = document.createElement("img");
    imgEdit.setAttribute("src", "icons_web/edit-2.svg");
    imgEdit.className = "m-1";
    imgEdit.setAttribute("data-bs-toggle", "modal");
    imgEdit.setAttribute("data-bs-target", "#editBillModal");
    imgEdit.setAttribute("alt", "Edytuj");
    imgEdit.setAttribute("data-toogle", "tooltip");
    imgEdit.setAttribute("title", "Edytuj rachunek");
    imgEdit.setAttribute("onclick", "idBillToEdit(this.parentNode.parentNode)")
    td.appendChild(imgEdit);

    //wstawienie ikony dolara - zapłać
    if (!element.wasPaid) {
        let imgPay = document.createElement("img");
        imgPay.setAttribute("src", 'icons_web/dollar-sign.svg');
        imgPay.className = "m-1";
        imgPay.setAttribute("data-bs-toggle", "modal");
        imgPay.setAttribute("data-bs-target", "#payBillModal");
        imgPay.setAttribute("alt", "Zapłać rachunek");
        imgPay.setAttribute("data-toogle", "tooltip");
        imgPay.setAttribute("title", "Zapłać rachunek");
        imgPay.setAttribute("onclick", "idBillToPay(this.parentNode.parentNode)")
        td.appendChild(imgPay);
    }


    tr.appendChild(td);
    console.log(element);
}


//funkcja wskazuje element do edycji
function idBillToEdit(object) {
    idBillContext = object.id;
    getBillByIdToEdit(object.id);


}

//funkcja wskazuje element do zapłaty
function idBillToPay(object) {
    idBillContext = object.id;
    getBillByIdToUpdate(object.id);
}

//funkcja wskazująca który ID rachunku do usunięcia
function idBillToDelete(object) {
    console.log(object);
    idBillContext = object.id;
    getBillByIdToDelete(object.id);
}


//pokaż dane z rachunku
function idBillToShow(object) {
    console.log(object);
    idBillContext = object.id;
    getBillByIdToShow(object.id);
}


//pobieranie rachunku po id do usunięcia
async function getBillByIdToDelete(id) {
    url = apiUrl + '/bill/' + id;
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let text = "Czy usunąć rachunek dla kategorii : " + data.category.name +
                "<br>o nr faktury/tytule zapłaty : " + data.invoiceNumber +
                "<br>na kwote: " + data.amount + " zł";
            document.getElementsByClassName("modal-body")[0].innerHTML = text;

        });

}

//funkcja usuwająca rachunek z bazy danej
async function delBillFromDb() {
    let id = idBillContext;
    await fetch(apiUrl + '/bill/' + id, {
        method: "DELETE"
    }).then(location.reload());
}
//  res => {res.json().then(log => {
//     console.log(log);


//pobieranie rachunku po id do podglądu
async function getBillByIdToShow(id) {
    url = apiUrl + '/bill/' + id;
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            document.getElementById("category").innerHTML = data.category.name;
            document.getElementById("accounNumber").innerHTML = data.category.accountNumber;
            document.getElementById("recipient").innerHTML = data.category.recipient;
            document.getElementById("invoiceNumber").innerHTML = data.invoiceNumber;
            document.getElementById("dateOfIssue").innerHTML = data.dateOfIssue;
            document.getElementById("dateOfPayment").innerHTML = data.dateOfPayment;
            document.getElementById("dateDue").innerHTML = data.dueDate;
            document.getElementById("wasPaid").innerHTML = data.wasPaid ? "TAK" : "NIE";
            document.getElementById("amount").innerHTML = data.amount + " zł";

        });

}

let billToUpdate;

//pobieranie rachunku po id do podglądu i zapisanie jej w zmiennej billToUpdate
function getBillByIdToUpdate(id) {
    url = apiUrl + '/bill/' + id;
    fetch(url)
        .then(res => res.json()
            .then(data => {
                console.log(data);
                billToUpdate = data;
                console.log(billToUpdate);

                document.getElementById("accountFieldPay").value = data.category.accountNumber;
                document.getElementById("recipientFieldPay").value = data.category.recipient;
                document.getElementById("invoiceFieldPay").value = data.invoiceNumber;
                document.getElementById("dateDueFieldPay").value = data.dueDate;
                document.getElementById("amountFieldPay").value = data.amount;

            }));

}

async function getBillByIdToEdit(id) {

    //fetch do kategorii
    url = apiUrl + '/bill/' + id;
    await fetch(url)
        .then(res => res.json()
            .then(data => {
                billToUpdate = data;
                console.log(billToUpdate);

                document.getElementById("invoiceFieldEdit").value = billToUpdate.invoiceNumber;
                document.getElementById("amountFieldEdit").value = billToUpdate.amount;
                document.getElementById("dateOfIssueFieldEdit").value = billToUpdate.dateOfIssue;
                document.getElementById("dateOfPaymentFieldEdit").value = billToUpdate.dateOfPayment;
                document.getElementById("dateDueFieldEdit").value = billToUpdate.dueDate;
                document.getElementById("checkWasPaid").checked = billToUpdate.wasPaid;
                changePayStatus();

            }));
    let obj;
    await fetch(apiUrl + '/category')
        .then(res => res.json())
        .then(data => obj = data);
    clearOptionsFast("editSelectCategory");
    let select = document.getElementsByTagName("select");
    obj.forEach(element => {

        if (element.id == billToUpdate.category.id) {
            insertCategoryToSelect(element, select, 1, true);
        } else {
            insertCategoryToSelect(element, select, 1, false);
        }

    });

}

//funkcja czyszcząca date w edycji rachunku wywoływana przy onchange w polu chcked
function changePayStatus() {
    console.log("dzalam");
    let fieldWasPaid = document.getElementById("checkWasPaid");
    let fieldDateDue = document.getElementById("dateDueFieldEdit");
    if (fieldWasPaid.checked == false) {
        fieldDateDue.value = "";
        fieldWasPaid.disabled = true;
        fieldDateDue.disabled = true;
    } else {
        fieldWasPaid.disabled = false;
        fieldDateDue.disabled = false;
    }

}



//funkcja czyszcząca option w 
function clearOptionsFast(id) {
    let selectObj = document.getElementById(id);
    let selectParentNode = selectObj.parentNode;
    let newSelectObj = selectObj.cloneNode(false); // Make a shallow copy
    selectParentNode.replaceChild(newSelectObj, selectObj);

}

//funkcja włączająca przycisk zapłać - jeżeli została wprowadzona data
function enableButtonPay() {
    let dateDue = document.getElementById("dateDueFieldPay").value;
    console.log(dateDue.length);
    if (dateDue.length == 10) {
        document.getElementById("buttonPay").disabled = false;
    } else {
        document.getElementById("buttonPay").disabled = true;
    }
}

//funkcja aktualizująca ( wprowadzająca date zapłaty i "TAK" w pole zapłacone)
async function updateBillInDb() {
    let dateDue = document.getElementById("dateDueFieldPay").value;

    billToUpdate.dueDate = dateDue;
    billToUpdate.wasPaid = true;
    console.log(billToUpdate);
    await fetch(apiUrl + '/bills', {
        method: "PUT",
        headers: {
            'Content-Type': "application/json;charset=UTF-8"
        },
        body: JSON.stringify(billToUpdate)
    }).then(res => res.json().then(data => {
        console.log(data);
        location.reload();

    }));
}

//funkcja aktualizujaca cały rachunek 
async function updateBillInDbAfterEdit() {
    let select = document.getElementById("editSelectCategory");
    billToUpdate.category.id = select.value;
    billToUpdate.invoiceNumber = document.getElementById("invoiceFieldEdit").value;
    billToUpdate.amount = document.getElementById("amountFieldEdit").value;
    billToUpdate.dateOfIssue = document.getElementById("dateOfIssueFieldEdit").value;
    billToUpdate.dateOfPayment = document.getElementById("dateOfPaymentFieldEdit").value;
    billToUpdate.dueDate = document.getElementById("dateDueFieldEdit").value;
    billToUpdate.wasPaid = document.getElementById("checkWasPaid").checked;
    await fetch(apiUrl + '/bills', {
        method: "PUT",
        headers: {
            'Content-Type': "application/json;charset=UTF-8"
        },
        body: JSON.stringify(billToUpdate)
    }).then(res => res.json().then(data => {
        console.log(data);
        location.reload();

    }));
}


//sortuje rosnąco obiekt tableBills i wypełnia na now tabele na stronie
function sortDateOfPaymentAsc() {
    //sortowanie po dacie
    tableBills.sort((a, b) => {
        let da = new Date(a.dateOfPayment);
        let db = new Date(b.dateOfPayment);
        return da - db;

    })
    replaceTbodyAndFillTable(tableBills);
    //sortowanie po stringach
    // tableBills.sort((a,b) => {
    //     let fa = a.dateOfPayment.touppercase??;
    //     let fb = b.dateOfPayment;

    // if (fa < fb) {
    //     return -1;
    // }
    // if (fa > fb) {
    //     return 1;
    // }
    // return 0;
    // })
}

//sortuje malejąco obiekt tableBills i wypełnia na now tabele na stronie
function sortDateOfPaymentDesc() {
    //sortowanie po dacie
    tableBills.sort((a, b) => {
        let da = new Date(a.dateOfPayment);
        let db = new Date(b.dateOfPayment);
        return db - da;

    })
    replaceTbodyAndFillTable(tableBills);
}

//zamienia cały znacznik tbody w table , wypełnia obiektem tableBills
function replaceTbodyAndFillTable(table) {
    let old_tbody = document.getElementById("tbody");
    let new_tbody = document.createElement("tbody");
    new_tbody.id = "tbody";
    fillTable(new_tbody, table);
    old_tbody.parentElement.replaceChild(new_tbody, old_tbody);
}

// filtrowanie  - tylko nie zapłacone
function filterByPaid() {

    if (document.getElementById("check1").checked) {
        let newTableBills = Array();
        tableBills.forEach(element => {
            if (!element.wasPaid) {
                newTableBills.push(element);
            }
        });
        tableBills = newTableBills;
        replaceTbodyAndFillTable(tableBills);
    } else {
        // tableBills = tableBillsConst;
        // replaceTbodyAndFillTable(tableBills);
        filterByCategory();
    }


}


//filtrowanie po kategoriach
function filterByCategory() {
    document.getElementById("check1").checked = false;
    let select = document.getElementById("select-category");
    console.log(select.value);
    if (select.value <= 0) {
        tableBills = tableBillsConst;
        replaceTbodyAndFillTable(tableBills);
        sortDateOfPaymentAsc();
    } else {
        let newTableBills = Array();
        tableBillsConst.forEach(element => {
            if (element.category.id == select.value) {
                newTableBills.push(element);
            }
        });
        tableBills = newTableBills;
        replaceTbodyAndFillTable(tableBills);
    }

}