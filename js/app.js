document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    const productInput = document.getElementById('productInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const productList = document.getElementById('productList');

    // Load todos from localStorage on page load
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        // Sort by due date descending
        todos.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        productList.innerHTML = '';
        todos.forEach((todo, idx) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center px-4 py-3 shadow-sm mb-3 rounded-3';

            const contentDiv = document.createElement('div');
            contentDiv.className = "d-flex flex-column";

            const span = document.createElement('span');
            span.textContent = todo.name;
            span.className = "fs-5";
            if (todo.completed) span.classList.add('completed');

            const badge = document.createElement('span');
            badge.className = "badge rounded-pill bg-info text-dark mt-1 align-self-start";
            badge.innerHTML = `<i class="bi bi-calendar-event"></i> Due: ${todo.dueDate}`;
            if (todo.completed) badge.classList.add('completed');

            contentDiv.appendChild(span);
            contentDiv.appendChild(badge);
            

            // Complete button
            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn-action done me-2';
            completeBtn.title = 'Mark as Done';
            completeBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
            completeBtn.onclick = function () {
                todo.completed = !todo.completed;
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
            };

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-action edit me-2';
            editBtn.title = 'Edit';
            editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
            editBtn.onclick = function () {
                if (li.querySelector('input[type="text"]')) return; // Already editing

                const input = document.createElement('input');
                input.type = 'text';
                input.value = todo.name;
                input.className = 'form-control form-control-sm me-2 mb-1';
                input.style.maxWidth = '200px';

                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.value = todo.dueDate;
                dateInput.className = 'form-control form-control-sm me-2 mb-1';
                dateInput.style.maxWidth = '200px';

                // Save button
                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn btn-success btn-sm me-2 mb-1';
                saveBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
                saveBtn.onclick = function () {
                    if (input.value.trim() !== '' && dateInput.value !== '') {
                        todo.name = input.value.trim();
                        todo.dueDate = dateInput.value;
                        localStorage.setItem('todos', JSON.stringify(todos));
                        renderTodos();
                    }
                };

                // Cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'btn btn-secondary btn-sm me-2 mb-1';
                cancelBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
                cancelBtn.onclick = function () {
                    renderTodos();
                };

                contentDiv.innerHTML = '';
                contentDiv.appendChild(input);
                contentDiv.appendChild(dateInput);
                contentDiv.appendChild(saveBtn);
                contentDiv.appendChild(cancelBtn);
            };

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-action delete';
            deleteBtn.title = 'Delete';
            deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
            deleteBtn.onclick = function () {
                todos.splice(idx, 1);
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
            };

            const btnGroup = document.createElement('div');
            btnGroup.appendChild(completeBtn);
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);

            li.appendChild(contentDiv);
            li.appendChild(btnGroup);

            productList.appendChild(li);
        });
    }


    

    productForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const productName = productInput.value.trim();
        const dueDate = dueDateInput.value;
        if (productName === '' || dueDate === '') return;

        todos.push({
            name: productName,
            dueDate: dueDate,
            completed: false
        });
        localStorage.setItem('todos', JSON.stringify(todos));
        // Clear inputs
        productInput.classList.remove('is-invalid');
        dueDateInput.classList.remove('is-invalid');
        productInput.classList.add('is-valid');
        dueDateInput.classList.add('is-valid');
        productForm.reset();
        renderTodos();
        productInput.value = '';
        dueDateInput.value = '';
        productInput.focus();
    });

    renderTodos();
});