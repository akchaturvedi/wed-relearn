// your first project 😂

let btn = document.getElementById("btn");
let inputTask = document.getElementById("todoinput");
let list = document.getElementById("todo-list");

// console.log(btn, inputTask, list);

let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
taskList.forEach((task) => renderTask(task));

btn.addEventListener("click", () => {
  const tasktext = inputTask.value.trim();
  if (tasktext === "") return;

  const newTask = {
    id: Date.now(),
    text: tasktext,
    completed: false,
  };

  taskList.push(newTask);
  saveTask();
  renderTask(newTask);
  inputTask.value = ""; //clear input
  console.log(taskList);
});

function renderTask(task) {
  console.log(task);
  const li = document.createElement("li");
  li.setAttribute("data-it", task.id);
  if (task.completed) li.classList.add("completed");
  li.innerHTML = `<span>${task.text}</span>
  <button>delete</button>`;
  li.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") return;
    task.completed = !task.completed;
    li.classList.toggle("completed");
    saveTask();
  });

  li.querySelector("button").addEventListener("click", (e) => {
    e.stopPropagation(); // prevent toggle from firing
    taskList = taskList.filter((t) => t.id === task.id);
    li.remove();
    saveTask();
  });
  list.appendChild(li);
}

function saveTask() {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}
