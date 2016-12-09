window.addEventListener('load', function () {

    var input = document.getElementsByName('task')[0],
        ul = document.getElementById('todo'),
        popup = document.getElementById('popup'),
        arrayTasks,
        editButton = document.createElement('button'),
        removeButton = document.createElement('button');

    editButton.className = 'edit';
    removeButton.className = 'remove';

    if (localStorage.getItem('items')) {
        arrayTasks = JSON.parse(localStorage.getItem('items'));
    } else {
        arrayTasks = [];
    }

    view();

    input.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
            add();
        }
    });

    document.getElementById('add').addEventListener('click', add);

    function add() {
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
         for (var i = 0; i < arrayTasks.length; i++) {
            var li = document.createElement('li');
            li.innerText = arrayTasks[i].value;
            if (arrayTasks[i].done === true) {
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
        var li = document.createElement('li');
        li.innerText = arrayTasks[arrayTasks.length - 1].value;
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
            for (var i = 0; i < arrayTasks.length; i++) {
                if (arrayTasks[i].value === a) {
                    arrayT[i].value = inputEdit.value;
                }
            }
            localStorage.setItem('items', JSON.stringify(arrayTasks));
        });

        document.getElementById('cancel').addEventListener('click', function (event) {
            popup.style.display = 'none';
        });
    }

    function removeHandler() {
        var index;
        for (var i = 0; i < arrayTasks.length; i++) {
            if (arrayTasks[i].value === this.parentElement.innerText) {
                index = i;
                this.parentElement.remove();
            }
        }
        arrayTasks.splice(index, 1);

        localStorage.setItem('items', JSON.stringify(arrayTasks));
        recount();
    }

    function select(event) {
        if (event.target.tagName == 'LI') {
            var el = event.toElement;
            el.classList.toggle('checked');

            for (var i = 0; i < arrayTasks.length; i++) {
                if (el.className === 'checked' && arrayTasks[i].value === el.firstChild.nodeValue) {
                    arrayTasks[i].done = true;
                } else {
                    arrayTasks[i].done = false;
                    recount();
                }
            }

            localStorage.setItem('items', JSON.stringify(arrayTasks));
        }
    }

    function recount() {
        var totalCount = document.querySelectorAll('li').length;
        var doneCount = document.querySelectorAll('li.checked').length;
        var count = totalCount - doneCount;
        document.getElementById('items-count').innerHTML = count + ' items to do / ' + doneCount + ' items done';
    }

    function dragNDrop(todoEl){
        var dragEl, nextEl, indexDragEl, indexNextEl;


        [].slice.call(todoEl.children).forEach(function (itemEl){
            itemEl.draggable = true;
        });

        function _onDragOver(event){
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';

            var target = event.target;
            if( target && target !== dragEl && target.nodeName == 'LI' ){
                var rect = target.getBoundingClientRect();
                var next = (event.clientY - rect.top)/(rect.bottom - rect.top) > .5;
                todoEl.insertBefore(dragEl, next && target.nextSibling || target);

                nextEl=target.textContent;
            }
        }

        function _onDragEnd(event){
            event.preventDefault();
            dragEl.classList.remove('ghost');
            todoEl.removeEventListener('dragover', _onDragOver, false);
            todoEl.removeEventListener('dragend', _onDragEnd, false);
        }

        todoEl.addEventListener('dragstart', function (event){
            dragEl = event.target;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('Text', dragEl.textContent);

            todoEl.addEventListener('dragover', _onDragOver, false);
            todoEl.addEventListener('dragend', _onDragEnd, false);

            for (var i = 0; i < arrayTasks.length; i++) {
                if (arrayTasks[i].value == dragEl.textContent) {
                    indexDragEl = i;
                    var content = arrayTasks[i];
                    console.log('indexDragEl', i);
                }
            }

            for (var j = 0; j < arrayTasks.length; j++) {
                if (arrayTasks[j].value == nextEl) {
                    indexNextEl = j;
                    console.log('indexNextEl', j);
                }
            }

            if (indexDragEl > indexNextEl) {
                arrayTasks.splice(indexNextEl, 0, content);
                arrayTasks.splice(indexDragEl+1, 1);
                localStorage.setItem('items', JSON.stringify(arrayTasks));
            } else {
                arrayTasks.splice(indexNextEl+1, 0, content);
                arrayTasks.splice(indexDragEl, 1);
                localStorage.setItem('items', JSON.stringify(arrayTasks));
            }

            setTimeout(function (){
                dragEl.classList.add('ghost');
            }, 0)
        }, false);
    }

    dragNDrop(document.getElementById('todo'));

});

document.onselectstart = function() {
    window.getSelection().removeAllRanges();
};
