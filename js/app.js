document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    const productInput = document.getElementById('productInput');
    const productList = document.getElementById('productList');

    productForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const productName = productInput.value.trim();
        if (productName === '') return;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center px-4 py-3 shadow-sm mb-3 rounded-3';

        const span = document.createElement('span');
        span.textContent = productName;
        span.className = "fs-5";

        // Complete button with icon
        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn-action done me-2';
        completeBtn.title = 'Mark as Done';
        completeBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        completeBtn.onclick = function () {
            span.classList.toggle('completed');
        };

        // Edit button with icon
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-action edit me-2';
        editBtn.title = 'Edit';
        editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
        editBtn.onclick = function () {
            if (li.querySelector('input')) return; // Already editing

            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.className = 'form-control form-control-sm me-2';
            input.style.maxWidth = '200px';

            // Save button
            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn btn-success btn-sm me-2';
            saveBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
            saveBtn.onclick = function () {
                if (input.value.trim() !== '') {
                    span.textContent = input.value.trim();
                }
                span.style.display = '';
                input.remove();
                saveBtn.remove();
                cancelBtn.remove();
            };

            // Cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-secondary btn-sm me-2';
            cancelBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
            cancelBtn.onclick = function () {
                span.style.display = '';
                input.remove();
                saveBtn.remove();
                cancelBtn.remove();
            };

            span.style.display = 'none';
            li.insertBefore(input, li.firstChild);
            li.insertBefore(saveBtn, li.firstChild.nextSibling);
            li.insertBefore(cancelBtn, li.firstChild.nextSibling.nextSibling);
            input.focus();
        };

        // Delete button with icon
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-action delete';
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
        deleteBtn.onclick = function () {
            productList.removeChild(li);
        };

        const btnGroup = document.createElement('div');
        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(btnGroup);

        productList.appendChild(li);
        productInput.value = '';
    });
});