$(function () {
    var ul = $('ul'),
        popup = $('#popup'),
        input = $('#todo'),
        inputEdit = $('#edit-input');

    if (localStorage.getItem('items')) {
        arrayTasks = JSON.parse(localStorage.getItem('items'));
    } else {
        arrayTasks = [];
    }

    view();

    //додавання елементу по кнопці
    $('#add').click(add);
    //додавання елементу по enter
    $('input[type="text"]').keypress(function (event) {
       if (event.keyCode === 13 ) {
           add();
       }
    });

    function drawItem(item) {
         var li = $('<li class="collection-item"><span class="text">' + item.value +
                   '</span><i class="material-icons edit right">mode_edit</i>' +
                   '<i class="material-icons remove right">delete</i></li>');

         if (item.complete == true) {
             li.addClass('done');
         }

        //видалення елементу
        li.find('.remove').click(function (event) {
                event.stopPropagation();
                for (var i = 0; i < arrayTasks.length; i++) {
                    if ($(event.target).parent().find('.text').text() == arrayTasks[i].value){
                        $(event.target).parent().remove();
                        arrayTasks.splice(i, 1);
                    }
                }
                localStorage.setItem('items', JSON.stringify(arrayTasks));
            });

        //редагування елементу
        li.find('.edit').click(function (event) {
            event.stopPropagation();
            popup.css('display', 'block');
            liEdit = $(event.target).parent().find('.text');
            inputEdit.val(liEdit.text());
            //зберегти редагування елементу
            $('#save').click(function (event) {
                for (var i = 0; i < arrayTasks.length; i++) {
                    if (liEdit.text() == arrayTasks[i].value) {
                        liEdit.text(inputEdit.val());
                        arrayTasks[i].value = inputEdit.val();
                    }
                }
                localStorage.setItem('items', JSON.stringify(arrayTasks));
                popup.css('display', 'none');
            });
            //вихід без збереження редагування
            $('#cancel').click(function () {
                popup.css('display', 'none');
            })
        });

        ul.append(li);
    }

    //функція додавання елементу
    function add() {
        if (input.val()) {
            drawItem({
                value: input.val()
            });
            arrayTasks.push({
                'value': input.val(),
                'complete': false
            });
            localStorage.setItem('items', JSON.stringify(arrayTasks));
            input.val('');
        }
    }

    ul.sortable({
        start: function(event, ui) {
            var startPos = ui.item.index();
            ui.item.data('startPos', startPos);
            console.log('start1', startPos);
        },
        update: function (event, ui) {
            var startPos = ui.item.data('startPos');
            var endPos = ui.item.index();
            console.log('end', endPos, 'start', startPos);
            if (startPos > endPos) {
                arrayTasks.splice(endPos, 0, arrayTasks[startPos]);
                arrayTasks.splice(startPos + 1, 1);
            } else {
                arrayTasks.splice(endPos + 1, 0, arrayTasks[startPos]);
                arrayTasks.splice(startPos, 1);
            }
            localStorage.setItem('items', JSON.stringify(arrayTasks));
        }
    })
        .click(function (event) {
            $(event.target).closest('li').toggleClass('done');
            if ($(event.target).closest('li').hasClass('done')) {
                for (i = 0; i < arrayTasks.length; i++) {
                    if ($(event.target).closest('li').find('.text').text() == arrayTasks[i].value) {
                        arrayTasks[i].complete = true;
                    }
                }
            } else {
                for (i = 0; i < arrayTasks.length; i++) {
                    if ($(event.target).closest('li').find('.text').text() == arrayTasks[i].value) {
                        arrayTasks[i].complete = false;
                    }
                }
            }
            localStorage.setItem('items', JSON.stringify(arrayTasks));
        });

    function view() {
        for (var i = 0; i < arrayTasks.length; i++) {
            drawItem(arrayTasks[i]);
        }
    }

});
