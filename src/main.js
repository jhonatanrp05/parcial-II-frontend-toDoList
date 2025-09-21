import "./style.css";

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
    <h1>Welcome to the App!</h1>
    <div class="counter">
        <button id="counter" type="button">count is 0</button>
    </div>

</div>
`;

const users = [
  {
    username: "admin",
    password: "admin",
  },
];

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
