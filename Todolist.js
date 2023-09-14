import Sortable from "sortablejs";
class Todo {
    constructor(text, completed = false, createdAt = new Date()) {
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt;
    }
    toggleCompletion() {
        this.completed = !this.completed;
    }
}
class TodoList {
    constructor() {
        this.todos = [];
        this.initializeDOMElements();
        this.addEventListeners();
        this.loadTodos();
        this.renderTodoList();
    }
    initializeDOMElements() {
        this.addTodoButton = this.getElement("add");
        this.todoList = this.getElement("list");
        this.todoInput = this.getElement("todo-input");
        this.filterButtons = [
            (this.allFilter = this.getElement("all")),
            (this.activeFilter = this.getElement("active")),
            (this.completedFilter = this.getElement("completed")),
        ];
    }
    addEventListeners() {
        this.allFilter.addEventListener("click", () => this.filterTodos("all"));
        this.activeFilter.addEventListener("click", () => this.filterTodos("active"));
        this.completedFilter.addEventListener("click", () => this.filterTodos("completed"));
        this.addTodoButton.addEventListener("click", () => this.addTodo(event));
        this.todoInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.addTodo(event);
            }
        });
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
                button.classList.add("text-white", "bg-blue-500", "font-semibold");
                button.classList.remove("text-blue-700", "bg-transparent");
            }
            else {
                button.classList.add("text-blue-700", "hover:text-white");
                button.classList.remove("text-white", "bg-blue-500", "font-semibold");
            }
        });
    }
    addTodo(event) {
        event.preventDefault();
        const inputValue = this.todoInput.value.trim();
        if (inputValue) {
            const todo = new Todo(inputValue);
            this.todos.push(todo);
            todo.createdAt = new Date();
            this.todoInput.value = "";
            this.saveTodos();
            this.renderTodoList();
            this.styleFilterButton("all");
        }
    }
    renderTodoList(filteredTodos) {
        this.todoList.innerHTML = "";
        this.setupDragAndDrop();
        if (!filteredTodos) {
            filteredTodos = this.todos;
        }
        // filteredTodos.sort(
        //   (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        // );
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
    setupDragAndDrop() {
        if (this.todoList) {
            new Sortable(this.todoList, {
                animation: 150,
                onEnd: (evt) => {
                    const startIndex = evt.oldIndex;
                    const endIndex = evt.newIndex;
                    if (startIndex !== undefined && endIndex !== undefined) {
                        const [removed] = this.todos.splice(startIndex, 1);
                        if (removed !== undefined) {
                            this.todos.splice(endIndex, 0, removed);
                            this.saveTodos();
                        }
                    }
                },
            });
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
        emptyMessage.classList.add("text-gray-500", "mt-4");
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
        this.todos[index].toggleCompletion();
        this.saveTodos();
        this.renderTodoList();
    }
    loadTodos() {
        const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
        this.todos = storedTodos.map((todoData) => {
            return new Todo(todoData.text, todoData.completed, new Date(todoData.createdAt));
        });
    }
    saveTodos() {
        localStorage.setItem("todos", JSON.stringify(this.todos));
    }
}
const todoApp = new TodoList();
