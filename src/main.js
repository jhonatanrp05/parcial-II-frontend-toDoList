import "./style.css";

const users = [
  {
    username: "admin",
    password: "admin",
  },
];

let userTasks = localStorage.getItem("tasksList")
  ? JSON.parse(localStorage.getItem("tasksList"))
  : [];

let tasks = [];

let idList = localStorage.getItem("idList")
  ? JSON.parse(localStorage.getItem("idList"))
  : 0;

let deletedApiTaskIds = localStorage.getItem("deletedApiTaskIds")
  ? JSON.parse(localStorage.getItem("deletedApiTaskIds"))
  : [];

const loginPage = /*html*/ `
<div class="container">

    <div class="loginContainer">
        <h2>TO DO LIST</h2>
        <h3 id="errorMessage"></h3>
        <form class="loginForm">
            <input type="text" id="inputUsername" name="username" required placeholder="Username" />
            <input type="password" id="inputPassword" name="password" required placeholder="Password" />
            <button id="loginButton" type="submit">Login</button>
        </form>
    </div>
</div>
`;

const toDoListPage = /*html*/ `
<div class="toDoListcontainer">
    <header>

        <button id="logoutButton" type="button">Logout</button>

    </header>
    <h1>To Do List</h1>
    <div class="taskInputContainer">
        <input type="text" id="taskInput" placeholder="Enter a new task" />
        <button id="addTaskButton" type="button">Add Task</button>
    </div>
    <ul id="taskList"></ul>
</div>
`;

const isLoggedIn = () => {
  const data = localStorage.getItem("loggedInUser");
  if (!data) return false;
  const loggedInUser = JSON.parse(data);
  return (
    loggedInUser[0].username === users[0].username &&
    loggedInUser[0].password === users[0].password
  );
};

const renderApp = () => {
  if (isLoggedIn()) {
    document.querySelector("#app").innerHTML = toDoListPage;

    // Load tasks from localStorage and render them
    const loadAndRenderTasks = async () => {
      let apiTasks = [];
      try {
        const response = await fetch(
          "https://dummyjson.com/c/28e8-a101-4223-a35c"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        apiTasks = await response.json();

        apiTasks = apiTasks.filter(
          (task) => !deletedApiTaskIds.includes(task.id)
        );
      } catch (error) {
        console.error("Error fetching external tasks:", error);
      }

      tasks = [...userTasks, ...apiTasks];
      tasks.sort((taskA, taskB) => taskB.createdAt - taskA.createdAt);

      renderTasks();
    };

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        renderApp();
      });
    }

    const addTaskButton = document.getElementById("addTaskButton");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    const renderTasks = () => {
      taskList.innerHTML = "";
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.done) {
          li.className = "taskDone";
        }
        li.textContent = task.text;

        const checkIcon = document.createElement("img");

        checkIcon.alt = "CheckIcon";
        if (task.done) {
          checkIcon.className = "checkIconDone";
          checkIcon.src = "./src/icons/checkIconWhite.svg";
        } else {
          checkIcon.className = "checkIcon";
          checkIcon.src = "./src/icons/checkIcon.svg";
        }
        checkIcon.addEventListener("click", () => {
          const taskToUpdate = tasks[index];
          taskToUpdate.done = !taskToUpdate.done;
          taskToUpdate.updatedAt = Date.now();

          const userTaskToUpdate = userTasks.find(
            (t) => t.id === taskToUpdate.id
          );
          if (userTaskToUpdate) {
            userTaskToUpdate.done = taskToUpdate.done;
            userTaskToUpdate.updatedAt = taskToUpdate.updatedAt;
            saveUserTasksToLocalStorage();
          }

          renderTasks();
        });

        const trashIcon = document.createElement("img");
        trashIcon.src = "./src/icons/trashIcon.svg";
        trashIcon.alt = "TrashIcon";
        trashIcon.className = "trashIcon";
        trashIcon.addEventListener("click", () => {
          const taskToRemove = tasks[index];

          const userTaskIndex = userTasks.findIndex(
            (t) => t.id === taskToRemove.id
          );
          if (userTaskIndex > -1) {
            userTasks.splice(userTaskIndex, 1);
            saveUserTasksToLocalStorage();
          } else {
            if (!deletedApiTaskIds.includes(taskToRemove.id)) {
              deletedApiTaskIds.push(taskToRemove.id);
              localStorage.setItem(
                "deletedApiTaskIds",
                JSON.stringify(deletedApiTaskIds)
              );
            }
          }

          tasks.splice(index, 1);
          renderTasks();
        });

        const editIcon = document.createElement("img");
        editIcon.src = "./src/icons/editIcon.svg";
        editIcon.alt = "EditIcon";
        editIcon.className = "editIcon";
        editIcon.addEventListener("click", () => {
          const originalText = task.text;
          const inputTextEdit = document.createElement("input");
          inputTextEdit.type = "text";
          inputTextEdit.value = task.text;
          const closeIcon = document.createElement("img");
          closeIcon.src = "./src/icons/closeIcon.svg";
          closeIcon.alt = "CloseIcon";
          closeIcon.className = "closeIcon";
          closeIcon.addEventListener("click", () => {
            renderTasks();
          });
          li.innerHTML = "";
          actionsButtonsContainer.innerHTML = "";
          actionsButtonsContainer.appendChild(closeIcon);
          li.appendChild(inputTextEdit);
          li.appendChild(actionsButtonsContainer);

          inputTextEdit.focus();

          inputTextEdit.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              const newText = inputTextEdit.value.trim();

              if (!newText) {
                alert("The task cannot be empty.");
                return;
              }
              if (newText.length < 10) {
                alert("The task must be at least 10 characters long.");
                return;
              }
              if (/^[0-9]+$/.test(newText)) {
                alert("The task cannot contain only numbers.");
                return;
              }

              const isDuplicate = tasks.some(
                (existingTask) =>
                  existingTask.text.toLowerCase() === newText.toLowerCase() &&
                  existingTask.text.toLowerCase() !== originalText.toLowerCase()
              );
              if (isDuplicate) {
                alert("This task already exists in the list.");
                return;
              }
              const taskToUpdate = tasks[index];
              taskToUpdate.text = newText;
              taskToUpdate.updatedAt = Date.now();

              const userTaskToUpdate = userTasks.find(
                (t) => t.id === taskToUpdate.id
              );
              if (userTaskToUpdate) {
                userTaskToUpdate.text = newText;
                userTaskToUpdate.updatedAt = taskToUpdate.updatedAt;
                saveUserTasksToLocalStorage();
              }

              renderTasks();
            }
          });
        });

        const actionsButtonsContainer = document.createElement("div");
        actionsButtonsContainer.className = "actionsButtonsContainer";
        li.appendChild(actionsButtonsContainer);
        actionsButtonsContainer.appendChild(checkIcon);
        actionsButtonsContainer.appendChild(editIcon);
        actionsButtonsContainer.appendChild(trashIcon);
        taskList.appendChild(li);
      });
    };

    const addTask = () => {
      const text = taskInput.value.trim();
      //validations
      if (!text) {
        alert("Task cannot be empty");
        return;
      }
      if (text.length < 10) {
        alert("The task must be at least 10 characters long.");
        return;
      }

      if (/^[0-9]+$/.test(text)) {
        alert("The task cannot be only numbers.");
        return;
      }
      const isDuplicate = tasks.some(
        (task) => task.text.toLowerCase() === text.toLowerCase()
      );
      if (isDuplicate) {
        alert("This task already exists in the list.");
        return;
      }

      const newTask = {
        id: idList + 1,
        text,
        done: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      idList += 1;
      userTasks.push(newTask);
      saveUserTasksToLocalStorage();
      tasks.push(newTask);
      tasks.sort((taskA, taskB) => taskB.createdAt - taskA.createdAt);
      taskInput.value = "";

      renderTasks();
    };

    const saveUserTasksToLocalStorage = () => {
      localStorage.setItem("tasksList", JSON.stringify(userTasks));
      localStorage.setItem("idList", JSON.stringify(idList));
    };

    addTaskButton.addEventListener("click", addTask);

    loadAndRenderTasks();
  } else {
    document.querySelector("#app").innerHTML = loginPage;

    const loginForm = document.querySelector(".loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("inputUsername").value;
        const password = document.getElementById("inputPassword").value;

        if (username === users[0].username && password === users[0].password) {
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify([
              {
                username,
                password,
              },
            ])
          );
          renderApp();
        } else {
          document.getElementById("errorMessage").textContent =
            "Invalid credentials";
        }
      });
    }
  }
};

renderApp();
