// =========================
// ELEMENTS
// =========================

const userInfo =
    document.getElementById("userInfo");

const username =
    document.getElementById("username");

const adminBadge =
    document.getElementById("adminBadge");

const manageProfiles =
    document.getElementById("manageProfiles");

const AdminSection =
    document.getElementById("AdminSection");

const managementContainer =
    document.getElementById("managementContainer");

const userSearch =
    document.getElementById("userSearch");

const searchSection =
    document.getElementById("searchSection");

const customPopup =
    document.getElementById("customPopup");

const confirmDeleteBtn =
    document.getElementById("confirmDelete");

const cancelDeleteBtn =
    document.getElementById("cancelDelete");

const customAlert =
    document.getElementById("customAlert");


// =========================
// STORAGE
// =========================

const token =
    localStorage.getItem("token");

const role =
    localStorage.getItem("role");


// =========================
// CONSTANTS
// =========================

const PROTECTED_ADMIN =
    "singhompal3313@gmail.com";


// =========================
// VARIABLES
// =========================

let allUsers = [];

let currentUserEmail = "";

let selectedUserId = null;


// =========================
// PROTECT PAGE
// =========================

if (!token) {

    window.location.href =
        "login.html";

}


// =========================
// SEARCH SECTION
// =========================

if (searchSection) {

    searchSection.style.display =
        role === "admin"
            ? "flex"
            : "none";

}


// =========================
// ADMIN UI
// =========================

if (role === "admin") {

    if (adminBadge) {

        adminBadge.innerText =
            "(ADMIN)";

    }

    if (manageProfiles) {

        manageProfiles.innerText =
            "Manage Profiles";

    }

    if (AdminSection) {

        AdminSection.style.display =
            "none";

    }

}


// =========================
// LOAD DASHBOARD
// =========================

async function loadDashboard() {

    try {

        const response =
            await fetch(

                "https://aksupyq-backend.onrender.com/api/dashboard/user",

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const user =
            await response.json();

        username.innerText =
            user.name;

        currentUserEmail =
            user.email;

        userInfo.innerHTML = `

            <p>
                Email: ${user.email}
            </p>

        `;

        if (role === "admin") {

            loadUsers();

        }

    } catch (error) {

        console.log(error);

    }

}

loadDashboard();


// =========================
// LOAD USERS
// =========================

async function loadUsers() {

    try {

        const response =
            await fetch(

                "https://aksupyq-backend.onrender.com/api/users",

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const users =
            await response.json();

        users.sort((a, b) => {

            // CURRENT USER FIRST

            if (a.email === currentUserEmail) {

                return -1;

            }

            if (b.email === currentUserEmail) {

                return 1;

            }

            // ADMINS SECOND

            if (a.role === "admin" &&
                b.role !== "admin") {

                return -1;

            }

            if (a.role !== "admin" &&
                b.role === "admin") {

                return 1;

            }

            // NAME SORT

            return a.name.localeCompare(b.name);

        });

        allUsers = users;

        renderUsers(users);

    } catch (error) {

        console.log(error);

    }

}


// =========================
// RENDER USERS
// =========================

function renderUsers(users) {

    managementContainer.innerHTML = "";

    if (users.length === 0) {

        managementContainer.innerHTML = `

            <p class="no-download">
                No users found
            </p>

        `;

        return;

    }

    users.forEach(user => {

        const isProtected =
            user.email === PROTECTED_ADMIN;

        const isCurrentUser =
            user.email === currentUserEmail;

        const userCard =
            document.createElement("div");

        userCard.classList.add("user-card");

        userCard.innerHTML = `

            <h2 class="user-name">

                ${user.name}

                ${isCurrentUser

                    ? `<span class="current-admin">
                        YOU
                       </span>`

                    : ""
                }

            </h2>

            <p>
                ${user.email}
            </p>

            <div class="role-badge">
                ${user.role}
            </div>

            <select
                ${isProtected ? "disabled" : ""}>

                <option
                    value="user"
                    ${user.role === "user"
                        ? "selected"
                        : ""}>

                    user

                </option>

                <option
                    value="admin"
                    ${user.role === "admin"
                        ? "selected"
                        : ""}>

                    admin

                </option>

            </select>

            <button
                class="delete-btn"

                ${isCurrentUser || isProtected
                    ? "disabled"
                    : ""}>

                Delete User

            </button>

        `;

        // =========================
        // CHANGE ROLE
        // =========================

        const select =
            userCard.querySelector("select");

        select.addEventListener(

            "change",

            () => {

                changeRole(

                    user._id,
                    select.value,
                    user.email

                );

            }

        );

        // =========================
        // DELETE USER
        // =========================

        const deleteBtn =
            userCard.querySelector(".delete-btn");

        deleteBtn.addEventListener(

            "click",

            () => {

                deleteUser(

                    user._id,
                    user.email

                );

            }

        );

        managementContainer.appendChild(userCard);

    });

}


// =========================
// SEARCH USERS
// =========================

if (userSearch) {

    userSearch.addEventListener(

        "input",

        () => {

            const searchValue =

                userSearch.value
                    .toLowerCase();

            const filteredUsers =

                allUsers.filter(user =>

                    user.name
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    user.email
                        .toLowerCase()
                        .includes(searchValue)

                );

            managementContainer.style.opacity =
                "0";

            setTimeout(() => {

                renderUsers(filteredUsers);

                managementContainer.style.opacity =
                    "1";

            }, 150);

        }

    );

}


// =========================
// CHANGE ROLE
// =========================

async function changeRole(

    id,
    roleValue,
    email

) {

    if (email === PROTECTED_ADMIN) {

        showAlert(
            "This admin role cannot be changed"
        );

        loadUsers();

        return;

    }

    try {

        const response =
            await fetch(

                `https://aksupyq-backend.onrender.com/api/users/role/${id}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        role: roleValue

                    })

                }

            );

        const data =
            await response.json();

        showAlert(data.message);

        loadUsers();

    } catch (error) {

        console.log(error);

    }

}


// =========================
// DELETE USER
// =========================

function deleteUser(id, email) {

    if (email === PROTECTED_ADMIN) {

        showAlert(
            "This admin cannot be deleted"
        );

        return;

    }

    selectedUserId = id;

    customPopup.classList.add("show");

}


// =========================
// ALERT
// =========================

function showAlert(message) {

    customAlert.innerText =
        message;

    customAlert.classList.add("show");

    setTimeout(() => {

        customAlert.classList.remove("show");

    }, 1200);

}


// =========================
// CONFIRM DELETE
// =========================

confirmDeleteBtn.addEventListener(

    "click",

    async () => {

        try {

            const response =
                await fetch(

                    `https://aksupyq-backend.onrender.com/api/users/delete/${selectedUserId}`,

                    {

                        method: "DELETE",

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );

            const data =
                await response.json();

            showAlert(data.message);

            customPopup.classList.remove("show");

            loadUsers();

        } catch (error) {

            console.log(error);

        }

    }

);


// =========================
// CANCEL DELETE
// =========================

cancelDeleteBtn.addEventListener(

    "click",

    () => {

        customPopup.classList.remove("show");

    }

);


// =========================
// LOGOUT
// =========================

document.getElementById("logoutbtn")

    .addEventListener(

        "click",

        () => {

            localStorage.clear();

            window.location.href =
                "login.html";

        }

    );