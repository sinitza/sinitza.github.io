window.addEventListener('load', function () {

    var input = document.getElementsByName('task')[0],
        ul = document.getElementById('todo'),
        popup = document.getElementById('popup'),
        arrayTasks,
        editButton = document.createElement('button'),
        removeButton = document.createElement('button');

    editButton.className = 'edit';
    removeButton.className = 'remove';

    view();

    input.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
            add();
        }
    });

    document.getElementById('add').addEventListener('click', add);

    function add() {
        if (localStorage.getItem('items')) {
            arrayTasks = JSON.parse(localStorage.getItem('items'));
        } else {
            arrayTasks = [];
        }
        if (input.value) {
            arrayTasks.push({
                value: input.value,
                done: false
            });
            input.value = '';
            localStorage.setItem('items', JSON.stringify(arrayTasks));
            render();
        } else {
            alert('you do not write');
        }
    }

    function view() {
        var array = JSON.parse(localStorage.getItem('items')) || [];

        for (var i = 0; i < array.length; i++) {
            var li = document.createElement('li');
            li.innerText = array[i].value;
            if (array[i].done === true) {
                li.classList.add('checked');
            }
            var editBtn = editButton.cloneNode();
            var removeBtn = removeButton.cloneNode();
            editBtn.addEventListener('click', editHandler);
            removeBtn.addEventListener('click', removeHandler);
            li.appendChild(editBtn);
            li.appendChild(removeBtn);
            li.onclick = select;
            ul.appendChild(li);
            recount();
        }
    }

    function render() {
        var array = JSON.parse(localStorage.getItem('items'));

        var li = document.createElement('li');
        li.innerText = array[array.length - 1].value;
        var editBtn = editButton.cloneNode();
        var removeBtn = removeButton.cloneNode();
        editBtn.addEventListener('click', editHandler);
        removeBtn.addEventListener('click', removeHandler);
        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        li.onclick = select;
        ul.appendChild(li);
        recount();
    }

    function editHandler(event) {
        var array = JSON.parse(localStorage.getItem('items'));

        this.classList.add('checked');
        popup.style.display = 'block';
        var inputEdit = document.getElementById('edit-input');
        inputEdit.value = this.parentElement.innerText;

        document.getElementById('save').addEventListener('click', function (event) {
            var btnEdit = document.querySelector('button.edit.checked');
            if (btnEdit) {
                var a = btnEdit.parentElement.firstChild.nodeValue;
                btnEdit.parentElement.firstChild.nodeValue = inputEdit.value;
                btnEdit.classList.remove('checked');
                popup.style.display = 'none';
            }
            for (var i = 0; i < array.length; i++) {
                if (array[i].value === a) {
                    array[i].value = inputEdit.value;
                }
            }
            localStorage.setItem('items', JSON.stringify(array));
        });

        document.getElementById('cancel').addEventListener('click', function (event) {
            popup.style.display = 'none';
        });
    }

    function removeHandler() {
        var array = JSON.parse(localStorage.getItem('items'));
        var index;
        console.log(this.parentElement.innerText);
        for (var i = 0; i < array.length; i++) {
            if (array[i].value === this.parentElement.innerText) {
                index = i;
                this.parentElement.remove();
            }
        }
        array.splice(index, 1);

        localStorage.setItem('items', JSON.stringify(array));
        recount();
    }

    function select(event) {
        var array = JSON.parse(localStorage.getItem('items'));
        if (event.target.tagName == 'LI') {
            console.log(event);
            var el = event.toElement;
            el.classList.toggle('checked');

            for (var i = 0; i < array.length; i++) {
                if (el.className === 'checked' && array[i].value === el.firstChild.nodeValue) {
                    array[i].done = true;
                } else {
                    array[i].done = false;
                    recount();
                }
                console.log(array[i].done);
            }

            localStorage.setItem('items', JSON.stringify(array));
        }
    }

    function recount() {
        var totalCount = document.querySelectorAll('li').length;
        var doneCount = document.querySelectorAll('li.checked').length;
        var count = totalCount - doneCount;
        document.getElementById('items-count').innerHTML = count + ' items to do / ' + doneCount + ' items done';
    }

})
