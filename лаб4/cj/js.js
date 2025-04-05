document.addEventListener("DOMContentLoaded", () => {


    window.addEventListener("beforeunload", () => {
        sessionStorage.removeItem("surveyResults");
    });
});

function saveData(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const entry = {};

    for (let [key, value] of formData.entries()) {
        if (entry[key]) {
            if (Array.isArray(entry[key])) {
                entry[key].push(value);
            } else {
                entry[key] = [entry[key], value];
            }
        } else {
            entry[key] = value;
        }
    }

    const storedData = JSON.parse(sessionStorage.getItem("surveyResults")) || [];
    storedData.push(entry);
    sessionStorage.setItem("surveyResults", JSON.stringify(storedData));

    event.target.reset();
}


function showResults() {
    let resultsWindow = window.open("", "_blank");

    let storedData = JSON.parse(sessionStorage.getItem("surveyResults")) || [];
    let doc = resultsWindow.document;

    let head = doc.createElement("head");
    head.innerHTML = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="cj/style.css">
    <title>Результаты опроса</title>
`;


    doc.head.appendChild(head);

    let body = doc.createElement("body");
    body.innerHTML = `
    <div class="header">Опрос покупателя мобильного телефона</div>

    <main>
        <div class="article" id="contentArea">
            <h2>Результаты опроса</h2>
            <button id="closeBtn">Закрыть</button>
            <button id="backBtn">Вернуться</button>
        </div>

        <div class="nav">
            Ваше мнение для нас очень важно!
            <br> ............
            <br> Мы очень рады, что вы решили пройти наш опрос!
            <br> ............
            <br> Вы помогаете нам становиться лучше!
            <br> ............
        </div>

        <div class="aside"></div>
    </main>

    <div class="footer">
        <p>&copy; 2025 Все права защищены</p>
    </div>
`;

    doc.body.appendChild(body);
    setTimeout(() => {
        let closeBtn = doc.getElementById("closeBtn");
        let backBtn = doc.getElementById("backBtn");

        if (closeBtn) {
            closeBtn.addEventListener("click", () => resultsWindow.close());
        }

        if (backBtn) {
            backBtn.addEventListener("click", () => resultsWindow.location.href = "index.html");
        }
    }, 100);

    loadResults(doc, storedData);
}

function loadResults(doc, storedData) {
    const contentArea = doc.getElementById("contentArea");

    if (!storedData.length) {
        contentArea.innerHTML += "<p>Пока данных нет.</p>";
        return;
    }

    const select = doc.createElement("select");
    select.id = "userSelect";
    storedData.forEach((entry, index) => {
        const option = new Option(entry["Имя"] || `Пользователь ${index + 1}`, index);
        select.appendChild(option);
    });
    select.addEventListener("change", () => updateTable(doc, storedData));

    contentArea.innerHTML += `
        <label for="userSelect">Выберите пользователя:</label>
    `;
    contentArea.appendChild(select);

    const table = doc.createElement("table");
    table.id = "resultsTable";
    table.innerHTML = "<tr><th>Поле</th><th>Значение</th></tr>";
    contentArea.appendChild(table);

    updateTable(doc, storedData); // Показываем первого по умолчанию
}


function updateTable(doc, storedData) {
    let selectedIndex = doc.getElementById("userSelect").value;
    let selectedEntry = storedData[selectedIndex];

    let table = doc.getElementById("resultsTable");
    table.innerHTML = "<tr><th>Поле</th><th>Значение</th></tr>";

    Object.entries(selectedEntry).forEach(([key, value]) => {
        let row = doc.createElement("tr");
        row.innerHTML = `<td>${key}</td><td>${value}</td>`;

        table.appendChild(row);
    });
}

function clearForm() {
    document.getElementById('surveyForm').reset();
}