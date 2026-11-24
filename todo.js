const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-input");
const todolist = document.querySelector(".todolist");
const selectTodos = document.querySelector(".filter-todos");
const backDrop = document.querySelector(".back-drop");
const modal = document.querySelector(".modal");
const modalInput = document.querySelector(".modal__input");
const modalRemove = document.querySelector(".modal__remove");
const modalSubmit = document.querySelector(".modal__submit");

let filterValue = "all";
let totalId;

// events
todoForm.addEventListener("submit", addNewtodo);
selectTodos.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  todosfun(todos);
});
modalRemove.addEventListener("click", closeModal);
// backDrop.addEventListener("click", closeModal);
modalSubmit.addEventListener("click", sendtodo);
// function
function addNewtodo(e) {
  e.preventDefault();
  if (!todoInput.value) return null;
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };

  saveTodo(newTodo);
  filterTodos();
}
function todosfun(todos) {
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
    <p class="todo__title ${todo.isCompleted && "completed"}">${todo.title}</p>
    <span class="todo__createdAt">${new Date(todo.createdAt).toLocaleDateString(
      "fa-IR"
    )}</span>
    <button class="todo__check" data-todo-id=${
      todo.id
    } ><i class="far fa-check-square"></i></button>
    <button class="todo__remove" data-todo-id=${
      todo.id
    } ><i class="far fa-trash-alt"></i></button>
    <button class="todo__edit" data-todo-id=${todo.id}>
    <i class="far fa-edit"></i>
  </button>
  </li>`;
  });
  todolist.innerHTML = result;
  todoInput.value = "";

  const removebtn = [...document.querySelectorAll(".todo__remove")];
  removebtn.forEach((btn) => {
    btn.addEventListener("click", removetodo);
  });

  const checkbtn = [...document.querySelectorAll(".todo__check")];
  checkbtn.forEach((btn) => {
    btn.addEventListener("click", checkTodo);
  });
  const editbtn = [...document.querySelectorAll(".todo__edit")];
  editbtn.forEach((btn) => {
    btn.addEventListener("click", editTodo);
  });
}

function editTodo(e) {
  openModal();
  totalId = Number(e.target.dataset.todoId);
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === totalId);
  modalInput.value = todo.title;
}
function sendtodo() {
  closeModal();
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === totalId);
  todo.title = modalInput.value;
  saveAllTodos(todos);
  filterTodos(todos);
}
function filterTodos() {
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      todosfun(todos);
      break;
    }
    case "completed": {
      todosfun(todos.filter((t) => t.isCompleted));
      break;
    }
    case "uncompleted": {
      todosfun(todos.filter((t) => !t.isCompleted));
      break;
    }
    default: {
      todosfun(todos);
    }
  }
}

function removetodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => todoId !== t.id);
  saveAllTodos(todos);
  filterTodos(todos);
}
function checkTodo(e) {
  const todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todosChecked = todos.find((t) => t.id === todoId);
  todosChecked.isCompleted = !todosChecked.isCompleted;
  saveAllTodos(todos);
  filterTodos(todos);
  // console.log(todos);
}
function openModal() {
  backDrop.classList.remove("hidden");
  modal.classList.remove("hidden");
}
function closeModal() {
  backDrop.classList.add("hidden");
  modal.classList.add("hidden");
}
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}
function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function getTodo() {
  return JSON.parse(localStorage.getItem("todos"));
}
