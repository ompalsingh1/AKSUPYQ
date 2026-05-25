const userInfo =
document.getElementById(
    "userInfo"
);

// const downloadContainer =
// document.getElementById(
//     "downloadContainer"
// );

const username =
document.getElementById(
    "username"
);

const token =
localStorage.getItem(
    "token"
);

const role =
localStorage.getItem(
    "role"
);

const adminBadge =
document.getElementById(
    "adminBadge"
);

const manageProfiles =
document.getElementById(
    "manageProfiles"
);

const AdminSection =
document.getElementById(
    "AdminSection"
);

const managementContainer =
document.getElementById(
    "managementContainer"
);

const userSearch =
document.getElementById(
    "userSearch"
);

const searchSection =
document.getElementById(
    "searchSection"
);

if(searchSection){

    searchSection.style.display =
    "flex";

}
if(role !== "admin" && searchSection){

    searchSection.style.display =
    "none";

}

const customPopup =
    document.getElementById(
        "customPopup"
    );

const confirmDeleteBtn =
    document.getElementById(
        "confirmDelete"
    );

const cancelDeleteBtn =
    document.getElementById(
        "cancelDelete"
    );

const customAlert =
    document.getElementById(
        "customAlert"
    );


let selectedPaperId = null;


// STORE USERS

let allUsers = [];


// CURRENT USER EMAIL

let currentUserEmail = "";


// PROTECT PAGE

if(!token){

    window.location.href =
    "login.html";

}


// ADMIN UI

if(role === "admin"){

    // ADMIN BADGE

    if(adminBadge){

        adminBadge.innerText =
        "(ADMIN)";

    }

    // CHANGE TITLE

    if(manageProfiles){

        manageProfiles.innerText =
        "Manage Profiles";

    }

    // HIDE DOWNLOAD HISTORY

    if(AdminSection){

        AdminSection.style.display =
        "none";

    }

}


// LOAD DASHBOARD

async function loadDashboard(){

    try {

        const response = await fetch(

            "http://localhost:5000/api/dashboard/user",

            {

                headers: {

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const user =
        await response.json();


        // USERNAME

        username.innerText =
        user.name;


        // STORE EMAIL

        currentUserEmail =
        user.email;


        // USER INFO

        userInfo.innerHTML = `

            <p>

                Email:
                ${user.email}

            </p>

        `;


        // USER DOWNLOADS

        if(role !== "admin"){

            loadDownloads(user);

        }


        // ADMIN USERS

        if(role === "admin"){

            loadUsers();

        }

    } catch(error){

        console.log(error);

    }

}

loadDashboard();


// LOAD DOWNLOADS

function loadDownloads(user){

    downloadContainer.innerHTML = "";

    if(user.downloads.length === 0){

        downloadContainer.innerHTML = `

            <p class="no-download">

                No downloads yet

            </p>

        `;

        return;

    }


    user.downloads.forEach(paper => {

        const paperCard =
        document.createElement("div");

        paperCard.classList.add(
            "download-paper"
        );

        paperCard.innerHTML = `

            <h3>
                ${paper.paperName}
            </h3>

            <p>
                Year:
                ${paper.year}
            </p>

        `;

        downloadContainer.appendChild(
            paperCard
        );

    });

}


// LOAD USERS

async function loadUsers(){

    try {

        const response = await fetch(

            "http://localhost:5000/api/users",

            {

                headers: {

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const users =
        await response.json();

        allUsers = users;

        renderUsers(users);

    } catch(error){

        console.log(error);

    }

}


// RENDER USERS

function renderUsers(users){

    managementContainer.innerHTML = "";


    if(users.length === 0){

        managementContainer.innerHTML = `

            <p class="no-download">

                No users found

            </p>

        `;

        return;

    }


    users.forEach(user => {

        const userCard =
        document.createElement("div");

        userCard.classList.add(
            "user-card"
        );


        userCard.innerHTML = `

            <h2 class="user-name">

                ${user.name}

                ${user.email === currentUserEmail

                ? `<span class="current-admin">

                    YOU

                   </span>`

                : ""}

            </h2>

            <p>
                ${user.email}
            </p>

            <div class="role-badge">

                ${user.role}

            </div>

            <select>

                <option
                value="user"

                ${user.role === "user"
                ? "selected" : ""}>

                    user

                </option>

                <option
                value="admin"

                ${user.role === "admin"
                ? "selected" : ""}>

                    admin

                </option>

            </select>

            <button

            class="delete-btn"

            ${user.email === currentUserEmail

            ? "disabled"

            : ""}>

                Delete User

            </button>

        `;


        // CHANGE ROLE

        const select =
        userCard.querySelector(
            "select"
        );

        select.addEventListener(

            "change",

            () => {

                changeRole(
                    user._id,
                    select.value
                );

            }

        );


        // DELETE USER

        userCard.querySelector(
            ".delete-btn"
        )

        .addEventListener(

            "click",

            () => {

                deleteUser(
                    user._id
                );

            }

        );


        managementContainer.appendChild(
            userCard
        );

    });

}


// SEARCH USERS

if(userSearch){

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

                renderUsers(
                    filteredUsers
                );

                managementContainer.style.opacity =
                "1";

            }, 150);

        }

    );

}


// CHANGE ROLE

async function changeRole(id, roleValue){

    try {

        const response = await fetch(

            `http://localhost:5000/api/users/role/${id}`,

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

        alert(data.message);

        loadUsers();

    } catch(error){

        console.log(error);

    }

}

// DELETE USER

function deleteUser(id){

    selectedUserId =
    id;

    customPopup.classList.add(
        "show"
    );

}

function showAlert(message){

    customAlert.innerText =
    message;

    customAlert.classList.add(
        "show"
    );

    setTimeout(() => {

        customAlert.classList.remove(
            "show"
        );

    }, 1200);

}
// CONFIRM DELETE

confirmDeleteBtn

.addEventListener(

    "click",

    async () => {

        try {

            const response =
            await fetch(

                `http://localhost:5000/api/users/delete/${selectedUserId}`,

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

            showAlert(
                data.message
            );

            customPopup.classList.remove(
                "show"
            );

            loadUsers();

        } catch(error){

            console.log(error);

        }

    }

);

// CANCEL DELETE

cancelDeleteBtn

.addEventListener(

    "click",

    () => {

        customPopup.classList.remove(
            "show"
        );

    }

);


// LOGOUT

document.getElementById(
    "logoutbtn"
)

.addEventListener(

    "click",

    () => {

        localStorage.clear();

        window.location.href =
        "login.html";

    }

);