document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const showTxtBtn = document.getElementById('showTxtBtn');
    const showXmlBtn = document.getElementById('showXmlBtn');
    const resultsDiv = document.getElementById('results');
    saveBtn.addEventListener('click', async () => {
        const formData = {
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            feedback: document.getElementById('feedback').value,
            newsletter: document.querySelector('[name="newsletter"]').checked ? 'Да' : 'Нет',
            agreement: document.querySelector('[name="agreement"]').checked ? 'Да' : 'Нет'
        };

        try {
            const response = await fetch('/save-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (result.success) {
                alert('Данные успешно сохранены!');
            } else {
                throw new Error(result.error || 'Ошибка сохранения');
            }
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        }
    });

    showTxtBtn.addEventListener('click', async () => {
        resultsDiv.textContent = 'Загрузка...';
        try {
            const response = await fetch('/get-txt');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.text();
            resultsDiv.textContent = data || 'Файл пуст';
        } catch (error) {
            resultsDiv.textContent = `Ошибка: ${error.message}`;
        }
    });

    showXmlBtn.addEventListener('click', async () => {
        resultsDiv.innerHTML = '<div class="loading">Загрузка...</div>';

        try {
            const response = await fetch('/get-xml');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const xmlText = await response.text();
            resultsDiv.innerHTML = xmlToTable(xmlText);
        } catch (error) {
            resultsDiv.innerHTML = `<div class="error">Ошибка: ${error.message}</div>`;
        }
    });
    function xmlToTable(xmlText) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            let html = '<table class="xml-table"><tr><th>Параметр</th><th>Значение</th></tr>';

            const forms = xmlDoc.getElementsByTagName('form');
            for (let form of forms) {
                for (let child of form.children) {
                    html += `<tr>
                        <td>${child.tagName}</td>
                        <td>${child.textContent}</td>
                    </tr>`;
                }
                html += '<tr><td colspan="2"><hr></td></tr>';
            }

            return html + '</table>';
        } catch (e) {
            return `<div class="error">Ошибка преобразования XML: ${e.message}</div>`;
        }
    }
});
