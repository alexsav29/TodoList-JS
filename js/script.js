const ToDoList = function () {
    let todos = [
        {
            id: '1',
            task: 'Выучить JS',
            isDone: false,
            isEdit: false
        },
        {
            id: '2',
            task: 'Выучить CSS',
            isDone: false,
            isEdit: false
        }
    ];

    this.init = (className) => {
        const parentContainer = document.querySelector(`.${className}`);
        if (!parentContainer) {
            console.log('Error. Неправильно введено название родительского контейнера (класса)');
            return;
        };

        const htmlToDoStructure = createHtmlToDo();
        parentContainer.appendChild(htmlToDoStructure);

        addToDo();
        render();
        addDeleteAllToDosEvent();
        addAllToDosNotDoneEvent();
        addAllToDosDoneSuper();
    };

    const createHtmlToDo = () => {
        const todo = document.createElement('div');
        todo.classList.add('todo');

        todo.innerHTML = `
                            <div class="todo__container">
                                <div class="todo__wrapper">
                                    <div class="todo__header">
                                        <h2 class="todo__title">Список дел</h2>
                                        <div class="todo__input__container"><input type="text" class="todo__input" placeholder="Введите задачу" /></div> 
                                        <div class="todo__button__container">
                                            <button class="delete__all__todos_btn btn">Очистить список дел</button>
                                            <button class="all__todos__done_btn btn">Все дела выполнены</button>
                                            <button class="all__todos__notdone_btn btn">Все дела НЕ выполнены</button>
                                        </div>
                                    </div>
                                    <div class="todo__body"></div>
                                </div>
                            </div>
                        `;
        return todo;
    };

    const addToDo = () => {
        const input = document.querySelector('.todo__input');
        input.addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                todos.push({
                    id: `${new Date().getTime()}`,
                    task: event.target.value,
                    isDone: false,
                    isEdit: false
                });

                event.target.value = '';
            };
            render();
        });
    };

    const render = () => {
        const todoBody = document.querySelector('.todo__body');

        if (todos.length === 0) {
            todoBody.innerHTML = `<h3 class="empty__result">Список дел пуст</h3>`;
            return;
        };

        let listToDo = '';

        const editHelper = editToDoHelper();

        todos.forEach(({ id, task, isDone, isEdit }) => {
            listToDo += `
                <li class="todo__item${isDone ? ' isDone' : ''}">
                        ${!isEdit ?
                    `
                            <div class="todo__task_container">
                                <input type="checkbox" ${isDone ? 'checked' : ''} class="todo__input__checkbox" id="${id}" />
                                <p class="todo__task">${task}</p>
                            </div>
                            <button class="todo__delete__btn btn" ${!isDone ? 'disabled' : ''} data-delete="${id}">Удалить</button>
                            <button class="todo__edit__btn btn" ${editHelper ? 'disabled' : ''} data-edit="${id}">Редактировать</button>
                        `
                    :
                    `
                            <div class="todo__task_container">
                                <input type="text" class="todo__input__edit" value="${task}" />
                            </div>
                            <button class="todo__cancel__btn btn" data-edit-cancel="${id}">Отмена</button>
                            <button class="todo__save__btn btn" data-edit-save="${id}">Сохранить</button>
                        `}
                </li>
                `;
        });

        const ul = document.createElement('ul');
        ul.classList.add('todo__ul');

        ul.innerHTML = listToDo;
        todoBody.innerHTML = '';
        todoBody.appendChild(ul);

        addCheckboxesToDoEvent();
        addDeleteToDoEvent();
        addEditToDoEvent();

        if (editHelper) {
            addEditCancel();
            addEditSave();
        };
    };

    const addDeleteAllToDosEvent = () => {
        const deleteAllBtn = document.querySelector('.delete__all__todos_btn');
        deleteAllBtn.addEventListener('click', () => {
            todos = [];
            render();
        });
    };

    const addCheckboxesToDoEvent = () => {
        const checkBoxes = document.querySelectorAll('.todo__input__checkbox');
        checkBoxes.forEach((checkBox) => {
            checkBox.addEventListener('click', (event) => {
                const todoId = event.target.id;
                todos = todos.map((todo) => {
                    if (todoId === todo.id) {
                        todo.isDone = !todo.isDone;
                    };
                    return todo;
                });
                render();
            });
        });
    };

    const addDeleteToDoEvent = () => {
        const deleteButtons = document.querySelectorAll('.todo__delete__btn');
        deleteButtons.forEach((btn) => {
            btn.addEventListener('click', (event) => {
                const todoId = event.target.dataset.delete;
                todos = todos.filter((todo) => todoId !== todo.id);
                render();
            });
        });
    };

    const addEditToDoEvent = () => {
        const editButtons = document.querySelectorAll('.todo__edit__btn');
        editButtons.forEach((editButton) => {
            editButton.addEventListener('click', (event) => {
                const todoId = event.target.dataset.edit;
                todos = todos.map((todo) => {
                    if (todoId === todo.id) {
                        todo.isEdit = true;
                    };
                    return todo;
                });
                render();
            });
        });
    };

    const editToDoHelper = () => todos.some((todo) => todo.isEdit);

    const addEditCancel = () => {
        const cancelButton = document.querySelector('.todo__cancel__btn');
        cancelButton.addEventListener('click', (event) => {
            const todoId = event.target.dataset.editCancel;
            todos = todos.map((todo) => {
                if (todoId === todo.id) {
                    todo.isEdit = false;
                };
                return todo;
            });
            render();
        });
    };

    const addEditSave = () => {
        const saveButton = document.querySelector('.todo__save__btn');
        saveButton.addEventListener('click', (event) => {
            const todoId = event.target.dataset.editSave;
            const newInputValue = document.querySelector('.todo__input__edit').value;

            todos = todos.map((todo) => {
                return {
                    ...todo,
                    ...(todoId === todo.id ? { task: newInputValue, isEdit: false } : undefined)
                };
            });
            render();
        });
    };

    const addAllToDosNotDoneEvent = () => {
        const allDoneButton = document.querySelector('.all__todos__notdone_btn');
        allDoneButton.addEventListener('click', () => {
            todos = todos.map((todo) => {
                todo.isDone = false;
                return todo;
            });
            render();
        });
    };


    const addAllToDosDoneSuper = () => {
        const allDoneButton = document.querySelector('.all__todos__done_btn');
        allDoneButton.addEventListener('click', () => {
            const allDoneHelper = allTodosDoneHelper();

            todos = todos.map((todo) => {
                if (allDoneHelper) {
                    todo.isDone = false;
                } else {
                    todo.isDone = true;

                }
                return todo;
            });
            render();
        });
    };

    const allTodosDoneHelper = () => todos.every((todo) => todo.isDone);

};



window.addEventListener('load', () => {
    const toDoList = new ToDoList();
    toDoList.init('app');
});