import "./style.css";

const users = [{
    username: "admin",
    password: "admin",
}, ];

const tasks = localStorage.getItem("tasksList") ?
    JSON.parse(localStorage.getItem("tasksList")) : [];

let idList = localStorage.getItem("idList") ?
    JSON.parse(localStorage.getItem("idList")) :
    0;

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
    <div class="header">
        <button id="logoutButton" type="button">Logout</button>
    </div>
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
            logoutButton.addEventListener("click", function() {
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
                    checkIcon.src = "./src/checkIconWhite.svg";
                } else {
                    checkIcon.className = "checkIcon";
                    checkIcon.src = "./src/checkIcon.svg";
                }
                checkIcon.addEventListener("click", () => {
                    task.done = !task.done;
                    localStorage.setItem("tasksList", JSON.stringify(tasks));
                    renderTasks();
                });

                const trashIcon = document.createElement("img");
                trashIcon.src = "./src/trashIcon.svg";
                trashIcon.alt = "TrashIcon";
                trashIcon.className = "trashIcon";
                trashIcon.addEventListener("click", () => {
                    tasks.splice(index, 1);
                    localStorage.setItem("tasksList", JSON.stringify(tasks));
                    renderTasks();
                });

                const actionsButtonsContainer = document.createElement("div");
                actionsButtonsContainer.className = "actionsButtonsContainer";
                li.appendChild(actionsButtonsContainer);
                actionsButtonsContainer.appendChild(checkIcon);
                actionsButtonsContainer.appendChild(trashIcon);

                taskList.appendChild(li);
            });
        };

        const addTask = () => {
            const text = taskInput.value.trim();
            if (text) {
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
            }
        };

        addTaskButton.addEventListener("click", addTask);
        renderTasks();
    } else {
        document.querySelector("#app").innerHTML = loginPage;

        const loginForm = document.querySelector(".loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", function(e) {
                e.preventDefault();
                const username = document.getElementById("inputUsername").value;
                const password = document.getElementById("inputPassword").value;

                if (username === users[0].username && password === users[0].password) {
                    localStorage.setItem(
                        "loggedInUser",
                        JSON.stringify([{
                            username,
                            password,
                        }, ])
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