let recordCounter = 1;
let records = {}; 
let properties = {};  

window.onload = function() {
    if (localStorage.getItem("records")) {
        records = JSON.parse(localStorage.getItem("records"));
        recordCounter = Object.keys(records).length + 1;
        updateTable();
        updateSelect();
    }

    if (localStorage.getItem("properties")) {
        properties = JSON.parse(localStorage.getItem("properties"));
        updateTable(); 
        updatePropertySelect();
    }
};
function addOrUpdateRecord() {
    let select = document.getElementById("recordId");
    let recordId = select.value || recordCounter++; 
    let carName = document.getElementById("carName").value;
    let ownerName = document.getElementById("ownerName").value;
    let plateNumber = document.getElementById("plateNumber").value;
    let parkingTime = document.getElementById("parkingTime").value;

    if (carName && ownerName && plateNumber && parkingTime) {
        records[recordId] = { carName, ownerName, plateNumber, parkingTime };
        alert("Запись успешно добавлена");
        updateLocalStorage();
        updateTable();
        updateSelect();
        clearForm();
    }
}

function deleteRecord() {
    let select = document.getElementById("recordId");
    let recordId = select.value;
    if (recordId && records[recordId]) {
        
        delete records[recordId];
        alert("Запись успешно удалена");
        renumberRecords();
        updateLocalStorage();
        updateTable();
        updateSelect();
        clearForm();
    }
}

function renumberRecords() {
    let newRecords = {};
    let newRecordCounter = 1;

    for (let oldId in records) {
        newRecords[newRecordCounter] = records[oldId];
        newRecordCounter++;
    }

    records = newRecords;
    recordCounter = newRecordCounter;
}

function loadRecord() {
    let select = document.getElementById("recordId");
    let recordId = select.value;
    if (records[recordId]) {
        document.getElementById("carName").value = records[recordId].carName;
        document.getElementById("ownerName").value = records[recordId].ownerName;
        document.getElementById("plateNumber").value = records[recordId].plateNumber;
        document.getElementById("parkingTime").value = records[recordId].parkingTime;
    } else {
        clearForm();
    }
}

function updateTable() {
    let table = document.getElementById("recordsTable");

    table.innerHTML = ""; 

    let headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>ID</th>
        <th>Название авто</th>
        <th>ФИО владельца</th>
        <th>Номер авто</th>
        <th>Время стоянки</th>`
    ;

    for (let prop in properties) {
        let th = document.createElement("th");
        th.innerText = properties[prop];
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let id in records) {
        let row = document.createElement("tr");
    
        let idCell = document.createElement("td");
        idCell.innerText = id;
        row.appendChild(idCell);
    
        let carNameCell = document.createElement("td");
        carNameCell.innerText = records[id].carName || "-";
        row.appendChild(carNameCell);
    
        let ownerNameCell = document.createElement("td");
        ownerNameCell.innerText = records[id].ownerName || "-";
        row.appendChild(ownerNameCell);
    
        let plateNumberCell = document.createElement("td");
        plateNumberCell.innerText = records[id].plateNumber || "-";
        row.appendChild(plateNumberCell);
    
        let parkingTimeCell = document.createElement("td");
        parkingTimeCell.innerText = records[id].parkingTime || "-";
        row.appendChild(parkingTimeCell);

        for (let prop in properties) {
            let propCell = document.createElement("td");
            propCell.innerText = records[id][prop] || "-";
            row.appendChild(propCell);
        }
    
        table.appendChild(row);
    }
}

function updateSelect() {
    let select = document.getElementById("recordId");
    select.innerHTML = '<option value="">Выберите ID записи</option>';
    for (let id in records) {
        let option = document.createElement("option");
        option.value = id;
        option.innerText = `ID: ${id}`;

        select.appendChild(option);
    }
}

function clearForm() {
    document.getElementById("carName").value = "";
    document.getElementById("ownerName").value = "";
    document.getElementById("plateNumber").value = "";
    document.getElementById("parkingTime").value = "";
}

function findMinMaxParkingTime() {
    if (Object.keys(records).length === 0) {
        alert("Нет записей для анализа.");
        return;
    }
    let minTime = Infinity, maxTime = -Infinity;
    let minCar = "", maxCar = "";

    for (let id in records) {
        let timeValue = records[id].parkingTime.split(":").reduce((h, m) => parseInt(h) * 60 + parseInt(m), 0);
        
        if (timeValue < minTime) {
            minTime = timeValue;
            minCar = records[id].carName;
        }
        if (timeValue > maxTime) {
            maxTime = timeValue;
            maxCar = records[id].carName;
        }
    }
    alert(`Авто с мин. временем: ${minCar}, авто с макс. временем: ${maxCar}`);

}

function addNewProperty() {
    let property = document.getElementById("newProperty").value;
    let value = document.getElementById("newValue").value;
    let select = document.getElementById("recordId");
    let recordId = select.value;

    if (property && value && recordId) {
      
        records[recordId][property] = value;

        if (!properties[property]) {
            properties[property] = property;
        }
        updateLocalStorage();
        updateTable();
        updatePropertySelect(); 
    } else {
        alert("Пожалуйста, выберите запись и заполните оба поля для свойства и значения.");
    }
}

function updateLocalStorage() {

    localStorage.setItem("records", JSON.stringify(records));
    localStorage.setItem("properties", JSON.stringify(properties));
}

function deleteProperty() {
    let propertyToDelete = document.getElementById("propertyToDelete").value;
    let deleteAll = document.getElementById("deleteAllRecords").checked;
    let select = document.getElementById("recordId");
    let recordId = select.value;

    if (propertyToDelete) {
        if (deleteAll) {
            for (let id in records) {
                delete records[id][propertyToDelete];
            }
            delete properties[propertyToDelete];
        } else if (recordId && records[recordId]) {
            delete records[recordId][propertyToDelete];
        }

        updateLocalStorage();
        updateTable();
        updatePropertySelect(); 
    
    } else {
        alert("Пожалуйста, выберите свойство для удаления.");
    }
}
function updatePropertySelect() {
    let select = document.getElementById("propertyToDelete");
    select.innerHTML = '<option value="">Выберите свойство для удаления</option>';

    for (let prop in properties) {
        let option = document.createElement("option");
        option.value = prop;
        option.innerText = prop;
        select.appendChild(option);
    }
}