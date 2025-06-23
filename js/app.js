document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    const productInput = document.getElementById('productInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const productList = document.getElementById('productList');

    // Load todos from localStorage on page load
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentPage = 1;
    const pageSize = 5;
    let filteredTodos = null; // for search

    // Pagination controls
    let paginationDiv = document.createElement('div');
    paginationDiv.className = 'd-flex justify-content-center my-3';
    productList.parentNode.appendChild(paginationDiv);

    function renderPagination(totalPages) {
        paginationDiv.innerHTML = '';
        if (totalPages <= 1) return;
        const ul = document.createElement('ul');
        ul.className = 'pagination';
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = 'page-item' + (i === currentPage ? ' active' : '');
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = i;
            a.onclick = function (e) {
                e.preventDefault();
                currentPage = i;
                renderTodos();
            };
            li.appendChild(a);
            ul.appendChild(li);
        }
        paginationDiv.appendChild(ul);
    }

    function renderTodos() {
        // Sort by due date descending
        const list = filteredTodos !== null ? filteredTodos : todos;
        list.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        productList.innerHTML = '';
        const totalPages = Math.ceil(list.length / pageSize) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        list.slice(startIdx, endIdx).forEach((todo, idx) => {
            const realIdx = filteredTodos !== null ? todos.indexOf(todo) : startIdx + idx;
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
                todos.splice(realIdx, 1);
                localStorage.setItem('todos', JSON.stringify(todos));
                if (filteredTodos) filteredTodos.splice(idx, 1);
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
        renderPagination(totalPages);
    }

    // Search input functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        filteredTodos = todos.filter(todo =>
            todo.name.toLowerCase().includes(searchTerm) ||
            todo.dueDate.includes(searchTerm)
        );
        currentPage = 1;
        renderTodos();
    });

    // Create modal HTML and append to body if not exists
    function ensureDeleteModal() {
        if (document.getElementById('deleteModal')) return;
        const modal = document.createElement('div');
        modal.innerHTML = `
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete this item?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
              </div>
            </div>
          </div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    ensureDeleteModal();

    let deleteIdx = null;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Override delete button behavior in renderTodos
    const originalRenderTodos = renderTodos;
    renderTodos = function () {
        originalRenderTodos();
        // Re-attach delete modal logic
        document.querySelectorAll('.btn-action.delete').forEach((btn, idx) => {
            btn.onclick = function () {
                deleteIdx = idx;
                deleteModal.show();
            };
        });
    };

    confirmDeleteBtn.onclick = function () {
        if (deleteIdx !== null) {
            todos.splice(deleteIdx, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
            deleteIdx = null;
            deleteModal.hide();
        }
        const deleteToast = new bootstrap.Toast(document.getElementById('deleteToast'));
       deleteToast.show();
    };

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
       // Show add toast
       const addToast = new bootstrap.Toast(document.getElementById('addToast'));
       addToast.show();
        // Clear inputs
        productInput.classList.remove('is-invalid');
        dueDateInput.classList.remove('is-invalid');
        productInput.classList.add('is-valid');
        dueDateInput.classList.add('is-valid');
        productForm.reset();
        filteredTodos = null;
        currentPage = 1;
        renderTodos();
        productInput.value = '';
        dueDateInput.value = '';
        productInput.focus();
    });

    renderTodos();
});