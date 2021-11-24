const apiUrl = "http://"+location.hostname+":8080";

document.addEventListener("load", startWeb());

//funkcja uruchamiająca się po załądowniu strony
function startWeb() {
    getCategory();
    enableButAddCat(false);


}

//zmienna globalna nr elementu do usunięcia
let idCatToDelete = 0;

//zmienne  do sprawdzenia czy wszystkie pola formularza są prawisłowo wypełnione
let isCorrectlyFieldCategory = false;
let isCorrectlyFieldAccountNumber = false;
let isCorrectlyFieldRecipient = false;




//funkcja pobiera categotie wydatków i umiescza w tabeli
async function getCategory() {
    let obj;
    await fetch(apiUrl+'/category')
        .then(res => res.json())
        .then(data => obj = data);
    // console.log(obj.length);
    let tbody = document.getElementsByTagName("tbody");
    obj.forEach(element => {
        insertCategoryToTab(element, tbody);
    });
}




//wstawia do tabeli pojedyńczy element
function insertCategoryToTab(element, tbody) {
    let tr = document.createElement("tr");
    let dbid = element.id;
    tr.setAttribute('dbid', dbid);
    tbody[0].appendChild(tr);
    let dataToTd = new Array(4);
    dataToTd[0] = element.name;
    dataToTd[1] = element.accountNumber;
    dataToTd[2] = element.recipient;
    let i = 0;
    dataToTd.forEach(tdData => {
        let td = document.createElement("td");
        td.setAttribute("class", document.getElementsByTagName("th")[i].className);
        td.innerHTML = tdData;
        tr.appendChild(td);
        i++;
    });
    let td = document.createElement("td");
    imgTrash = document.createElement("img");
    imgTrash.setAttribute("src", "icons/trash-2.svg");
    imgTrash.setAttribute("id", element.id);
    imgTrash.setAttribute("data-bs-toggle", "modal");
    imgTrash.setAttribute("data-bs-target", "#delCatModal");
    imgTrash.setAttribute("alt", "Usuń");
    imgTrash.setAttribute("onclick", "idCatToDel(this)");
    td.appendChild(imgTrash);
    tr.appendChild(td);
    console.log(element);
}

//funkcja do ustawienia zmiennej globalne idCatToDel - przekazanie id w tabeli category
function idCatToDel(object) {
    idCatToDelete = object.id;
    console.log(idCatToDelete);

    getCategoryByIdToDelete(object.id);


    //poprawić aby wyświetlał wszystkie dane z kateorii
}

// funkcja wysyła do bazy danej categorię do zapisania
async function saveCategoryToDb() {
    let categoryName = document.getElementById("category-name").value;
    let accountNumber = document.getElementById("account-number").value;
    let recipient = document.getElementById("recipient").value;
    let category = {
        "id": null,
        "name": categoryName,
        "accountNumber": accountNumber,
        "recipient": recipient
    };
    await fetch(apiUrl+'/categories', {
        method: "POST",
        headers: {
            'Content-Type': "application/json;charset=UTF-8"
        },
        body: JSON.stringify(category)
    }).then(res => res.json().then(data => {
        console.log(data);
        location.reload();
        // clearFieldsIndForm();
        // let tbody = document.getElementsByTagName("tbody");
        // insertCategryToTab(data, tbody);
    }));
}

//funkcja usuwająca gategorię z bazy danej
function delCategoryFromDb() {
    let id = idCatToDelete;
    fetch(apiUrl+'/category/' + id, {
        method: "DELETE"
    }).then(res => res.json().then(res => {
        console.log(res);
        if (res){
            location.reload();
        }else {
            console.log("Error the category is use in Bills");
        }
    } ));
 }

//pobieranie categorii po id do usunięcia
async function getCategoryByIdToDelete(id) {
    url = apiUrl+'/category' + '/' + id;
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let text = "Czy usunąć kategorię : " + data.name + "<br>Odbiorca : " + data.recipient;
            document.getElementsByClassName("modal-body")[0].innerHTML = text;

        });

}

function accountNumberCheck(accountNumber) {
    if (accountNumber.length == 26) {
        let reg = new RegExp('^[0-9]*$');
        console.log(reg.test(accountNumber));

        return true;
    } else {
        return false;
    }

}
// testowe konto
//    26 1750 1312 5020 0000 0000 5886   
function accounFieldUpdate() {
    let accountNumber = document.getElementById("account-number").value;
    accountNumber = accountNumber.replace(/\D+/g, "");
    // accountNumber = accountNumber.replace(/\s/g, ""); //pozbywanie się białych znaków
    document.getElementById("account-number").value = accountNumber;
    if (accountNumber.length == 26) {
        let reg = new RegExp('^[0-9]*$');
        console.log(reg.test(accountNumber));
        if (reg.test(accountNumber)) {
            url = apiUrl+'/accountcheck/' + accountNumber;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    accountIsValid(data);
                    validateFormFields();
                });

        } else {
            accountIsValid(false);
        }

    } else {
        accountIsValid(false);
    }
    validateFormFields();
}

function accountIsValid(valid) {
    isCorrectlyFieldAccountNumber = valid;
    if (valid) {
        document.getElementById("account-number").style.backgroundColor = "white";
    } else {
        document.getElementById("account-number").style.backgroundColor = "lightsalmon";
    }

}

function nameCategoryFieldUpdate() {
    let nameCategory = document.getElementById("category-name").value;
    if (nameCategory.length > 3) {
        isCorrectlyFieldCategory = true;
    } else {
        isCorrectlyFieldCategory = false;
    }
    validateFormFields();
}

function recipientCategoryFieldUpdate() {
    let recipient = document.getElementById("recipient").value;
    console.log(recipient)
    if (recipient.length > 5) {
        isCorrectlyFieldRecipient = true;
    } else {
        isCorrectlyFieldRecipient = false;
    }
    validateFormFields();
}

function enableButAddCat(enable) {
    document.getElementById("buttonAddCategory").disabled = !enable;
}

function validateFormFields() {
    if (isCorrectlyFieldAccountNumber && isCorrectlyFieldCategory && isCorrectlyFieldRecipient) {
        enableButAddCat(true);
    } else {
        enableButAddCat(false);
    }
}

