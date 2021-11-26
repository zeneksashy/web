const idInput = document.getElementById("inputId");
const nameInput = document.getElementById("inputName");
const dateInput = document.getElementById("inputDate");
const ul = document.querySelector("ul");
const addTask = document.getElementById("myBtn");
const searchClearButton = document.getElementById("srcClearBtn");
const edtDateInput = document.getElementsByClassName("edtDate");
const svBtn = document.getElementsByClassName("SaveBtn");
const saveChanges = document.getElementsByClassName("savBtn");
const searchIdInput = document.getElementById("searchId");
const searchNameInput = document.getElementById("searchName");
const searchDateInput = document.getElementById("searchDate");
const txtAlert = document.getElementById("inputTaskAlert");
const dateAlert = document.getElementById("inputDateAlert");

idInput.classList.add("newTaskInput");


let Item = class {
    constructor(id, name, due_to) {
        this.id = id;
        this.name = name;
        if (due_to ==="")
            due_to = "TBD"
        this.due_to = due_to;
    }

    ToString() {
        return this.id + ";" + this.name + ";" + this.due_to + ";";
    }

    static FromString(str) {
        const res = str.split(';')
        return new Item(res[0], res[1], res[2])
    }
}
let TODO = class {
    constructor() {
        for (let item in {...localStorage}) {
            console.log(localStorage.getItem(item));
            item = Item.FromString(localStorage.getItem(item));
            CreateTaskInDom(item);
        }
    }


    AddItem(item) {
        localStorage.setItem(item.id, item.ToString());
        CreateTaskInDom(item);
    }

    RemoveItem(item,index) {
        localStorage.removeItem(item.id);
        ul.removeChild(ul.childNodes[index]);
    }

    EditItem(item) {
        this.AddItem(item);
    }

    Find(id) {
        for (let item in {...localStorage}) {
            item = Item.FromString(localStorage.getItem(item));
            if (item.id === id)
                return true;
        }
        return false;

    }

    Search(id, name, date) {
        for (let item in {...localStorage}) {
            item = Item.FromString(localStorage.getItem(item));
            console.log(item.toString());
            if (item.id.includes(id) && item.name.includes(name) && item.due_to.includes(date))
                CreateTaskInDom(item);
        }
    }

    Clear() {
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }

    Reset() {
        this.Clear()
        for (let item in {...localStorage}) {
            console.log(localStorage.getItem(item));
            item = Item.FromString(localStorage.getItem(item));
            CreateTaskInDom(item);
        }
    }

    Load(path) {

    }

    Export(path) {

    }
};

todoList = new TODO()

function CreateTaskInDom(task) {
    let id = task.id
    let name = task.name
    let date = task.due_to

    let item = `<li class="listLi form-inline checked" >
                    <input type="text" class = "txtInput form-control form-input col-1 id" pattern=".{3,255}" disabled style="display: inline">
                    <input type="text" class = "txtInput form-control form-input col-6 name"" style="display: inline">
                    <input type="date" class = "dateInput form-control form-input col-3" style="display: inline">
                    <button type="button" class = "savBtn btn btn-primary col-1" style="display: inline">Edit</button>
                    <button type="button" class = "delBtn btn btn-primary col-1" style="display: inline">Del</button>  
                </li>`

    ul.insertAdjacentHTML('beforeend', item);
    let insertedNewLi = ul.lastChild
    insertedNewLi.querySelector(".id").value = id;
    insertedNewLi.querySelector(".name").value = name;
    insertedNewLi.querySelector(".dateInput").value = date;
}


searchClearButton.addEventListener("click", function (e) {
    todoList.Reset();
});

document.querySelector(".sb").addEventListener("click", function () {
        if (searchIdInput.value || searchNameInput.value || searchDateInput.value) {
            todoList.Clear();
            todoList.Search(searchIdInput.value, searchNameInput.value, searchDateInput.value);
        }
    }
);


// Add new task function
addTask.addEventListener("click", function (e) {

    if (validateId(idInput,false) && validateDate(dateInput) && validateTitle(nameInput)) {
        const newTask = new Item(idInput.value, nameInput.value, dateInput.value);
        todoList.AddItem(newTask);
        document.getElementById("form1").reset();
    }
});
ul.addEventListener('click', function (ev) {
        let target = ev.target;
        let parent = target.parentElement;
        const _idInput = parent.querySelector(".id");
        const _nameInput = parent.querySelector(".name");
        const _dateInput = parent.querySelector(".dateInput");
        const oldTask = new Item(_idInput.value, _nameInput.value, _dateInput.value);
        let deleteBtn = parent.querySelector(".delBtn");
        let saveBtn = parent.querySelector(".savBtn");
        let index = Array.prototype.indexOf.call(parent.parentElement.children, parent);
        if (target === deleteBtn) {
            todoList.RemoveItem(oldTask,index);
        } else if (target === saveBtn) {
            if (validateId(_idInput,true) && validateDate(_dateInput) && validateTitle(_nameInput)) {
                const newTask = new Item(_idInput.value, _nameInput.value, _dateInput.value)

                todoList.RemoveItem(oldTask,index);
                todoList.EditItem(newTask);
            }
        }
    }
    , false);


// refresh list with data from local storage

function validateDate(input) {
    dateAlert.innerText = "";
    if (input.value == '') {
        return true;
    }
    let today = new Date().setHours(0, 0, 0, 0);
    let inputDate = new Date(input.value).setHours(0, 0, 0, 0);
    if (inputDate < today) {
        dateAlert.innerText = "niepoprawna data";
        dateAlert.style.display = "inline-block";
        return false;
    }
    return true;
}

function validateId(input, editing) {
    txtAlert.innerText = ""
    if (input.value.length != 3 || !input.value.match("[A-Z]\\d{2}")) {
        txtAlert.innerText = "Zly kod";
        txtAlert.style.display = "inline-block";
        return false;
    }
    if(!editing && todoList.Find(input.value))
    {
        txtAlert.innerText = "Kod juz istnieje";
        txtAlert.style.display = "inline-block";
        return false;
    }

    return true;
}

function validateTitle(input) {
    txtAlert.innerText = ""
    if (input.value.length < 3 || input.value.length > 256) {
        txtAlert.innerText = "DLugosc tytulu nieprawidlowa"
        txtAlert.style.display = "inline-block"
        return false;
    }
    return true;
}

