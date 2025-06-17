import { addElement } from "./index.js";
import {
  activeButton,
  allTasksButton,
  app,
  buttonAdd,
  clearButton,
  comletedButton,
  containerCards,
  inputTask,
  itemsLeft,
  toggleDarkMode,
} from "./elements.js";

const bindTaskEvents = () => {
  const checkIcons = document.querySelectorAll(".check");
  checkIcons.forEach((icon, index) => {
    icon.addEventListener("click", (e) => checkState(e, index));
    icon.addEventListener("keydown", (e) => {
      e.key === "Enter" && checkState(e, index);
    });
  });
  const deleteIcons = document.querySelectorAll(".cross");
  deleteIcons.forEach((icon, index) => {
    icon.addEventListener("click", (e) => deleteTasks(e, index));
    icon.addEventListener("keydown", (e) => {
      e.key === "Enter" && deleteTasks(e, index);
    });
  });
};
export const renderTasks = (tasks) => {
  let result = "";
  const sanitize = (str) => {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  tasks.forEach((task, index) => {
    result += `
    <li class="card group/card ${
      task.isCompleted ? " card--completed" : ""
    }" draggable="true">
    <i class="fa-solid fa-check check" tabindex="0"></i>
      <p class="task">${sanitize(task.value)}</p>
      <img
        src="./images/icon-cross.svg"
        alt="cross icon"
        class="cross mr-5 cursor-pointer opacity-0 group-hover/card:opacity-100 transition-all"
        tabindex="0"
      />
    </li>
  `;
  });

  containerCards.innerHTML = "";
  containerCards.insertAdjacentHTML("afterbegin", result);
  inputTask.value = "";
  bindTaskEvents();
};
export const randerEmpteyState = () => {
  let empty = `<li
              class="empty-state flex flex-col items-center bg-white group-[.app--isDark]:bg-[hsl(235,24%,19%)]"
            >
              <img src="./images/folder.png" alt="" class="empty-icon w-56" />
              <p class="empty-txt text-gray-400">Cann't found tasks...!</p>
            </li>`;

  containerCards.innerHTML = empty;
};

export const saveToDB = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
export const checkState = (e, index) => {
  e.preventDefault();
  const tasks = fetchData("tasks") || [];

  tasks[index].isCompleted = !tasks[index].isCompleted;
  saveToDB("tasks", tasks);
  renderItemsLeft(tasks);
  renderTasks(tasks);
};

export const deleteTasks = (e, index) => {
  const ask = confirm("Do you want to delete this task ?");
  if (!ask) return;
  const tasks = fetchData("tasks") || [];

  tasks.splice(index, 1);
  saveToDB("tasks", tasks);
  renderItemsLeft(tasks);
  tasks.length ? renderTasks(tasks) : randerEmpteyState();
};

export const renderItemsLeft = (tasks) => {
  let count = 0;
  tasks.forEach((task) => {
    if (!task.isCompleted) {
      count++;
    }
  });
  itemsLeft.textContent = `${count} items left`;
};
export const render = () => {
  const tasks = fetchData("tasks") || [];

  if (tasks.length) {
    renderTasks(tasks);
  } else {
    randerEmpteyState();
  }
};

export const clearCompletedTasks = () => {
  const ask = confirm("Do you want to clear completed tasks?");
  if (!ask) return;

  const tasks = fetchData("tasks") || [];

  const completedTasks = tasks.filter((task) => task.isCompleted);

  if (!completedTasks.length) {
    alert("Not found completed tasks..!");
    return;
  }

  const activeTasks = tasks.filter((task) => !task.isCompleted);
  saveToDB("tasks", activeTasks);

  if (activeTasks.length) {
    renderTasks(activeTasks);
  } else {
    randerEmpteyState();
  }
};

export const showComleted = () => {
  const tasks = fetchData("tasks") || [];
  const comleted = tasks.filter((task) => task.isCompleted);
  comleted.length ? renderTasks(comleted) : randerEmpteyState();
};

export const activeTask = () => {
  const tasks = fetchData("tasks") || [];
  const active = tasks.filter((task) => !task.isCompleted);
  active.length ? renderTasks(active) : randerEmpteyState();
};

export const darkMode = () => {
  app.classList.toggle("app--isDark");
  saveToDB("darkModeFlag", app.classList.contains("app--isDark"));
};
export const events = () => {
  toggleDarkMode.addEventListener("click", darkMode);
  fetchData("darkModeFlag") && darkMode();
  clearButton.addEventListener("click", clearCompletedTasks);
  clearButton.addEventListener("keydown", (e) => {
    e.key === "Enter" && clearCompletedTasks();
  });
  comletedButton.addEventListener("click", showComleted);
  comletedButton.addEventListener("keydown", (e) => {
    e.key === "Enter" && showComleted();
  });
  activeButton.addEventListener("click", activeTask);

  activeButton.addEventListener("keydown", (e) => {
    e.key === "Enter" && activeTask();
  });

  buttonAdd.addEventListener("click", (e) => {
    e.preventDefault();
    addElement();
  });
  allTasksButton.addEventListener("click", render);
  allTasksButton.addEventListener("keydown", (e) => {
    e.key === "Enter" && render();
  });
};

export const saveToDBDrag = () => {
  const tasks = [];

  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const value = card.textContent.trim();
    const original = fetchData("tasks").find((task) => task.value === value);

    original && tasks.push(original);
  });

  saveToDB("tasks", tasks);
};
