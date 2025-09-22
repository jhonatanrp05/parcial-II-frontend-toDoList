import "./style.css";

const users = [
  {
    username: "admin",
    password: "admin",
  },
];

const tasks = localStorage.getItem("tasksList")
  ? JSON.parse(localStorage.getItem("tasksList"))
  : [];

let idList = localStorage.getItem("idList")
  ? JSON.parse(localStorage.getItem("idList"))
  : 0;

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
          task.done = !task.done;
          task.updatedAt = new Date().toLocaleString();
          localStorage.setItem("tasksList", JSON.stringify(tasks));
          renderTasks();
        });

        const trashIcon = document.createElement("img");
        trashIcon.src = "./src/icons/trashIcon.svg";
        trashIcon.alt = "TrashIcon";
        trashIcon.className = "trashIcon";
        trashIcon.addEventListener("click", () => {
          tasks.splice(index, 1);
          localStorage.setItem("tasksList", JSON.stringify(tasks));
          renderTasks();
        });

        const editIcon = document.createElement("img");
        editIcon.src = "./src/icons/editIcon.svg";
        editIcon.alt = "EditIcon";
        editIcon.className = "editIcon";
        editIcon.addEventListener("click", () => {
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
              if (newText) {
                task.text = newText;
                task.updatedAt = new Date().toLocaleString();
                localStorage.setItem("tasksList", JSON.stringify(tasks));
                renderTasks();
              }
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

    const showPopupMessage = (message) => {
      let popup = document.getElementById("popupMessage");
      if (!popup) {
        popup = document.createElement("div");
        popup.id = "popupMessage";
        document.body.appendChild(popup);
      }
      popup.textContent = message;
      popup.style.display = "block";
      setTimeout(() => {
        popup.style.display = "none";
      }, 2000);
    };

    const addTask = () => {
      const text = taskInput.value.trim();
      if (text) {
        if (tasks.find((task) => task.text === text)) {
          showPopupMessage("Task already exists");
          return;
        }

        if (text.length < 10) {
          showPopupMessage("Task is too short (min 10 characters)");
          return;
        }
        const now = new Date();
        const newTask = {
          id: idList + 1,
          text,
          done: false,
          createdAt: now.toLocaleString(),
          updatedAt: now.toLocaleString(),
        };
        idList += 1;
        tasks.push(newTask);
        taskInput.value = "";
        localStorage.setItem("tasksList", JSON.stringify(tasks));
        renderTasks();
      } else {
        showPopupMessage("Please enter a task");
      }
    };
    const fetchButton = document.createElement("button");
    fetchButton.id = "fetchButton";
    fetchButton.type = "button";
    fetchButton.textContent = "Fetch Tasks from API";
    fetchButton.className = "fetchButton";
    fetchButton.addEventListener("click", () => {
      const fetchApi = async () => {
        try {
          const response = await fetch(
            "https://dummyjson.com/c/28e8-a101-4223-a35c"
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          data.forEach((item) => {
            item.id = idList + 1;
            idList += 1;
            tasks.push(item);
          });
          localStorage.setItem("tasksList", JSON.stringify(tasks));
          localStorage.setItem("idList", JSON.stringify(idList));
          renderTasks();
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      fetchApi();
    });

    const toDoListcontainer = document.querySelector(".toDoListcontainer");
    toDoListcontainer.appendChild(fetchButton);
    addTaskButton.addEventListener("click", addTask);
    renderTasks();
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
