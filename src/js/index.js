const taskList = [];
const doneTaskList = [];

function handleLocalStorage() {
	if (taskList.length === 0 && doneTaskList.length === 0) {
		localStorage.removeItem("@tasks");
		localStorage.removeItem("@doneTasks");
		return;
	}
	localStorage.setItem("@tasks", JSON.stringify(taskList));
	localStorage.setItem("@doneTasks", JSON.stringify(doneTaskList));
}

document.addEventListener("DOMContentLoaded", () => {
	let tasks = JSON.parse(localStorage.getItem("@tasks")) || [];
	let doneTasks = JSON.parse(localStorage.getItem("@doneTasks")) || [];
	if (tasks.length > 0) {
		tasks.forEach((item) => {
			taskList.push(item);
			createTask(item);
		});
	}
	if (doneTasks.length > 0) {
		doneTasks.forEach((item) => {
			doneTaskList.push(item);
			handleTaskDone(item);
		});
	}
});

function idCount() {
	let count = crypto.randomUUID();
	return count;
}

function changeTask() {
	let value = document.getElementById("task-input").value;
	if (!value.trim()) {
		alert("Invalid input. Please add a new task!");
	} else {
		const id = idCount();
		const item = {
			id,
			task: value,
			done: false,
		};
		taskList.push(item);
		createTask(item);
	}
}

function createTask(item) {
	const taskcontainer = document.getElementById("task-container");
	const taskItem = document.createElement("div");
	taskItem.classList.add("task-item-container");
	taskItem.id = `${item.id}-task`;
	taskItem.innerHTML = `
	<p>${item.task}</p>
	<div class="btn-container">
		<button class="conclude"><i class="fa-solid fa-check"></i></button>
		<button class="trash"><i class="fa-solid fa-trash"></i></button>
	</div>
`;
	const concludeBtn = taskItem.querySelector(".conclude");
	concludeBtn.addEventListener("click", () => concludeTask(item.id));
	const removeBtn = taskItem.querySelector(".trash");
	removeBtn.addEventListener("click", () => removeTask(item.id));
	taskcontainer.appendChild(taskItem);
	document.getElementById("task-input").value = "";
	handleLocalStorage();
}

function concludeTask(id) {
	if (!id) return;
	const index = taskList.findIndex((task) => task.id === id);
	let task = taskList[index];
	console.log("tes", task, index);
	let update = {
		id: task.id,
		task: task.task,
		done: !task.done,
	};
	const doneIndex = doneTaskList.findIndex((taskId) => taskId.id === id);
	taskList[index] = update;
	if (update.done === true) {
		if (doneIndex === -1) {
			doneTaskList.push(update);
		}
	} else {
		doneTaskList.splice(doneIndex, 1);
	}
	handleTaskDone(update);
}

function removeTask(id) {
	const taskcontainer = document.getElementById("task-container");
	const taskItem = document.getElementById(`${id}-task`);
	let index = taskList.findIndex((taskId) => taskId.id === id);
	if (taskList[index].done === true) {
		const doneContainer = document.getElementById("done-container");
		const taskDoneItem = document.getElementById(`task-${id}`);
		if (taskDoneItem && doneContainer.contains(taskDoneItem)) {
			const doneIndex = doneTaskList.findIndex((taskId) => taskId.id === id);
			doneTaskList.splice(doneIndex, 1);
			doneContainer.removeChild(taskDoneItem);
		}
	}
	taskList.splice(index, 1);
	taskcontainer.removeChild(taskItem);
	handleLocalStorage();
}

function handleTaskDone(item) {
	if (!item) return;
	const doneContainer = document.getElementById("done-container");
	const itemIsExist = document.getElementById(`task-${item.id}`);
	if (item.done === true && !itemIsExist) {
		// Done is true
		const taskItem = document.createElement("div");
		taskItem.classList.add("task-item-container");
		taskItem.id = `task-${item.id}`;
		taskItem.innerHTML = `<p id="item-done">${item.task}</p>`;
		doneContainer.appendChild(taskItem);
	} else if (item.done === false && itemIsExist) {
		// Done is false
		doneContainer.removeChild(itemIsExist);
	}
	handleLocalStorage();
}
