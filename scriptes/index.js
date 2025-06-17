// import { cards } from "./elements.js";
import { containerCards, inputTask } from "./elements.js";
import {
  events,
  fetchData,
  render,
  renderItemsLeft,
  saveToDB,
  saveToDBDrag,
} from "./functions.js";

const addElement = () => {
  let valueInput = inputTask.value.trim();

  if (!valueInput) {
    alert("Please enter your tasks...!");
    return;
  }

  if (valueInput.length < 4) {
    alert("Sorry, at least 4 characters ....!");
    return;
  }
  const task = {
    value: valueInput,
    isCompleted: false,
  };

  const tasks = fetchData("tasks") || [];
  const isDuplicate = tasks.some((t) => t.value === task.value);
  if (isDuplicate) {
    inputTask.value = "";
    alert("Your task is duplicate!");
    return;
  }

  tasks.push(task);
  saveToDB("tasks", tasks);
  render();
  renderItemsLeft(tasks);
};

render();
renderItemsLeft(fetchData("tasks"));
export { addElement };

events();

// cards.forEach((card) => {
// card.addEventListener("dragstart", () => {
// card.classList.add("is-dragging");
// });
// });
Sortable.create(containerCards, {
  animation: 150,
  ghostClass: "card--is-dragging",
  onEnd: saveToDBDrag,
});
