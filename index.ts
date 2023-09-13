interface Todo {
  text: string;
  completed: boolean;
}

class TodoApp {
  private addTodoButton: HTMLElement;
  private todoList: HTMLElement;
  private todoInput: HTMLInputElement;
  private filterButtons: HTMLElement[];
  private allFilter: HTMLElement;
  private activeFilter: HTMLElement;
  private completedFilter: HTMLElement;
  private todos: Todo[] = [];

  constructor() {
    // Initialisation des éléments DOM
    this.addTodoButton = this.getElement("add")!;
    this.todoList = this.getElement("list")!;
    this.todoInput = this.getElement("todo-input") as HTMLInputElement;
    this.filterButtons = [
      (this.allFilter = this.getElement("all")!),
      (this.activeFilter = this.getElement("active")!),
      (this.completedFilter = this.getElement("completed")!),
    ];

    // Ajout des écouteurs d'événements
    this.allFilter.addEventListener("click", () => this.filterTodos("all"));
    this.activeFilter.addEventListener("click", () =>
      this.filterTodos("active")
    );
    this.completedFilter.addEventListener("click", () =>
      this.filterTodos("completed")
    );

    this.addTodoButton.addEventListener("click", () => this.addTodo());
    this.todoInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.addTodo();
      }
    });

    this.loadTodos();
    this.renderTodoList();
  }

  private getElement(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  private filterTodos(filter: string) {
    this.styleFilterButton(filter);
    const filteredTodos =
      filter === "active"
        ? this.todos.filter((todo) => !todo.completed)
        : filter === "completed"
        ? this.todos.filter((todo) => todo.completed)
        : this.todos;

    this.renderTodoList(filteredTodos);
  }

  private styleFilterButton(filter: string) {
    this.filterButtons.forEach((button) => {
      if (button.id === filter) {
        button.classList.add("text-blue-500");
      } else {
        button.classList.remove("text-blue-500");
      }
    });
  }

  private addTodo() {
    const inputValue = this.todoInput.value.trim();
    if (inputValue) {
      this.todos.push({ text: inputValue, completed: false });
      this.todoInput.value = "";
      this.saveTodos();
      this.renderTodoList();
    }
  }

  private renderTodoList(filteredTodos?: Todo[]) {
    this.todoList.innerHTML = "";

    if (!filteredTodos) {
      filteredTodos = this.todos;
    }

    filteredTodos.forEach((todo, index) => {
      this.renderTodo(todo, index);
    });

    if (this.todos.length > 0) {
      this.renderTodoInfo();
    } else {
      this.renderEmptyMessage();
    }
  }

  private renderTodoInfo() {
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
    clearButton.classList.add(
      "text-red-500",
      "cursor-pointer",
      "p-2",
      "rounded",
      "border",
      "border-red-500",
      "hover:bg-red-500",
      "hover:text-white"
    );
    clearButton.addEventListener("click", () => this.clearAll());

    todoInfos.appendChild(leftTodos);
    todoInfos.appendChild(clearButton);
    this.todoList.appendChild(todoInfos);
  }

  private renderEmptyMessage() {
    const emptyMessage = this.createParagraphElement("You have no todos!");
    this.todoList.appendChild(emptyMessage);
  }

  private renderTodo(todo: Todo, index: number) {
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
    } else {
      todoText.classList.add("no-underline");
    }

    const deleteButton = this.createDeleteButton();
    const completionButton = this.createCompletionButton(index, todo.completed);

    deleteButton.addEventListener("click", () => this.deleteTodo(index));
    completionButton.addEventListener("click", () =>
      this.toggleCompletion(index)
    );

    li.appendChild(completionButton);
    li.appendChild(todoText);
    li.appendChild(deleteButton);
    this.todoList.appendChild(li);
  }

  private createDivElement(classes: string[]): HTMLElement {
    const div = document.createElement("div");
    div.classList.add(...classes);
    return div;
  }

  private createParagraphElement(text: string): HTMLElement {
    const p = document.createElement("p");
    p.innerText = text;
    return p;
  }

  private createSpanElement(text: string): HTMLElement {
    const span = document.createElement("span");
    span.innerText = text;
    return span;
  }

  private createButton(text: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.innerText = text;
    return button;
  }

  private createLiElement(classes: string[]): HTMLElement {
    const li = document.createElement("li");
    li.classList.add(...classes);
    return li;
  }

  private createDeleteButton(): HTMLElement {
    const deleteButton = this.createIcon("fa-solid", "fa-x");
    deleteButton.classList.add(
      "hidden",
      "cursor-pointer",
      "ml-auto",
      "group-hover:block"
    );
    return deleteButton;
  }

  private createCompletionButton(
    index: number,
    completed: boolean
  ): HTMLElement {
    const iconClass = completed ? "fa-check-circle" : "fa-circle";
    const completionButton = this.createIcon("fa-regular", iconClass);
    completionButton.classList.add("text-green-500", "cursor-pointer");
    return completionButton;
  }

  private createIcon(prefix: string, iconName: string): HTMLElement {
    const icon = document.createElement("i");
    icon.classList.add(prefix, iconName);
    return icon;
  }

  private clearAll() {
    this.todos = [];
    this.saveTodos();
    this.renderTodoList();
  }

  private deleteTodo(index: number) {
    this.todos.splice(index, 1);
    this.saveTodos();
    this.renderTodoList();
  }

  private toggleCompletion(index: number) {
    this.todos[index].completed = !this.todos[index].completed;
    this.saveTodos();
    this.renderTodoList();
  }

  private loadTodos() {
    const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    this.todos = storedTodos;
  }

  private saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }
}

const todoApp = new TodoApp();
