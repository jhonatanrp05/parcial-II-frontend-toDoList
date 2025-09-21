import "./style.css";

const loginPage = /*html*/ `
<div class="container">

    <div class="loginContainer">
        <h2>Login</h2>
        <form class="loginForm">
            <input type="text" id="inputUsername" name="username" required placeholder="Username" />
            <input type="password" id="inputPassword" name="password" required placeholder="Password" />
            <button id="loginButton" type="submit">Login</button>
        </form>
    </div>
</div>
`;

const toDoListPage = /*html*/ `
<div class="app-container">
    <h1>Welcome to the App!</h1>
    <div class="counter">
        <button id="counter" type="button">count is 0</button>
    </div>
</div>



`;

document.querySelector("#app").innerHTML = loginPage;
