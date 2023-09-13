"use strict";
class TodoApp {
    constructor() {
        this.todos = [];
        // Initialisation des éléments DOM
        this.addTodoButton = this.getElement("add");
        this.todoList = this.getElement("list");
        this.todoInput = this.getElement("todo-input");
        this.filterButtons = [
            (this.allFilter = this.getElement("all")),
            (this.activeFilter = this.getElement("active")),
            (this.completedFilter = this.getElement("completed")),
        ];
        // Ajout des écouteurs d'événements
        this.allFilter.addEventListener("click", () => this.filterTodos("all"));
        this.activeFilter.addEventListener("click", () => this.filterTodos("active"));
        this.completedFilter.addEventListener("click", () => this.filterTodos("completed"));
        this.addTodoButton.addEventListener("click", () => this.addTodo());
        this.todoInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.addTodo();
            }
        });
        this.loadTodos();
        this.renderTodoList();
    }
    getElement(id) {
        return document.getElementById(id);
    }
    filterTodos(filter) {
        this.styleFilterButton(filter);
        const filteredTodos = filter === "active"
            ? this.todos.filter((todo) => !todo.completed)
            : filter === "completed"
                ? this.todos.filter((todo) => todo.completed)
                : this.todos;
        this.renderTodoList(filteredTodos);
    }
    styleFilterButton(filter) {
        this.filterButtons.forEach((button) => {
            if (button.id === filter) {
                button.classList.add("text-blue-500");
            }
            else {
                button.classList.remove("text-blue-500");
            }
        });
    }
    addTodo() {
        const inputValue = this.todoInput.value.trim();
        if (inputValue) {
            this.todos.push({ text: inputValue, completed: false });
            this.todoInput.value = "";
            this.saveTodos();
            this.renderTodoList();
        }
    }
    renderTodoList(filteredTodos) {
        this.todoList.innerHTML = "";
        if (!filteredTodos) {
            filteredTodos = this.todos;
        }
        filteredTodos.forEach((todo, index) => {
            this.renderTodo(todo, index);
        });
        if (this.todos.length > 0) {
            this.renderTodoInfo();
        }
        else {
            this.renderEmptyMessage();
        }
    }
    renderTodoInfo() {
        const todoInfos = this.createDivElement([
            "flex",
            "items-center",
            "justify-between",
            "w-full",
            "mt-4",
        ]);
        const leftTodos = this.createParagraphElement("");
        leftTodos.innerText =
            this.todos.length === 1
                ? `${this.todos.length} todo left`
                : `${this.todos.length} todos left`;
        leftTodos.classList.add("text-gray-500");
        const clearButton = this.createButton("Clear All");
        clearButton.classList.add("text-red-500", "cursor-pointer", "p-2", "rounded", "border", "border-red-500", "hover:bg-red-500", "hover:text-white");
        clearButton.addEventListener("click", () => this.clearAll());
        todoInfos.appendChild(leftTodos);
        todoInfos.appendChild(clearButton);
        this.todoList.appendChild(todoInfos);
    }
    renderEmptyMessage() {
        const emptyMessage = this.createParagraphElement("You have no todos!");
        this.todoList.appendChild(emptyMessage);
    }
    renderTodo(todo, index) {
        const li = this.createLiElement([
            "flex",
            "items-center",
            "gap-2",
            "w-full",
            "border-b-2",
            "border-gray-300",
            "py-2",
            "group",
        ]);
        const todoText = this.createSpanElement(todo.text);
        if (todo.completed) {
            todoText.classList.add("line-through", "text-gray-500");
        }
        else {
            todoText.classList.add("no-underline");
        }
        const deleteButton = this.createDeleteButton();
        const completionButton = this.createCompletionButton(index, todo.completed);
        deleteButton.addEventListener("click", () => this.deleteTodo(index));
        completionButton.addEventListener("click", () => this.toggleCompletion(index));
        li.appendChild(completionButton);
        li.appendChild(todoText);
        li.appendChild(deleteButton);
        this.todoList.appendChild(li);
    }
    createDivElement(classes) {
        const div = document.createElement("div");
        div.classList.add(...classes);
        return div;
    }
    createParagraphElement(text) {
        const p = document.createElement("p");
        p.innerText = text;
        return p;
    }
    createSpanElement(text) {
        const span = document.createElement("span");
        span.innerText = text;
        return span;
    }
    createButton(text) {
        const button = document.createElement("button");
        button.innerText = text;
        return button;
    }
    createLiElement(classes) {
        const li = document.createElement("li");
        li.classList.add(...classes);
        return li;
    }
    createDeleteButton() {
        const deleteButton = this.createIcon("fa-solid", "fa-x");
        deleteButton.classList.add("hidden", "cursor-pointer", "ml-auto", "group-hover:block");
        return deleteButton;
    }
    createCompletionButton(index, completed) {
        const iconClass = completed ? "fa-check-circle" : "fa-circle";
        const completionButton = this.createIcon("fa-regular", iconClass);
        completionButton.classList.add("text-green-500", "cursor-pointer");
        return completionButton;
    }
    createIcon(prefix, iconName) {
        const icon = document.createElement("i");
        icon.classList.add(prefix, iconName);
        return icon;
    }
    clearAll() {
        this.todos = [];
        this.saveTodos();
        this.renderTodoList();
    }
    deleteTodo(index) {
        this.todos.splice(index, 1);
        this.saveTodos();
        this.renderTodoList();
    }
    toggleCompletion(index) {
        this.todos[index].completed = !this.todos[index].completed;
        this.saveTodos();
        this.renderTodoList();
    }
    loadTodos() {
        const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
        this.todos = storedTodos;
    }
    saveTodos() {
        localStorage.setItem("todos", JSON.stringify(this.todos));
    }
}
const todoApp = new TodoApp();
