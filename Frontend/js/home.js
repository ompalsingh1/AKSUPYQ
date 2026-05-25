const branchContainer =
document.getElementById(
    "branchContainer"
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

const customAlert =
document.getElementById(
    "customAlert"
);

const branchModal =
document.getElementById(
    "branchModal"
);

const deletePopup =
document.getElementById(
    "deletePopup"
);

const branchInput =
document.getElementById(
    "branchInput"
);

const modalTitle =
document.getElementById(
    "modalTitle"
);

const saveModal =
document.getElementById(
    "saveModal"
);

const cancelModal =
document.getElementById(
    "cancelModal"
);

const confirmDelete =
document.getElementById(
    "confirmDelete"
);

const cancelDelete =
document.getElementById(
    "cancelDelete"
);

let editMode = false;

let selectedBranchId = null;


// ADMIN BADGE

if(role === "admin" && adminBadge){

    adminBadge.innerText =
    "(ADMIN)";

}


// PROTECT PAGE

if(!token){

    window.location.href =
    "login.html";

}


// CUSTOM ALERT

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


// LOAD BRANCHES

async function loadBranches(){

    try {

        const response = await fetch(

            "http://localhost:5000/api/branches"

        );

        const branches =
        await response.json();

        branchContainer.innerHTML =
        "";


        // SHOW BRANCHES

        branches.forEach(branch => {

            const branchCard =
            document.createElement(
                "div"
            );

            branchCard.classList.add(
                "branch-card"
            );


            branchCard.innerHTML = `

                <h3>
                    ${branch.branchName}
                </h3>

                ${role === "admin"

                ?

                `

                <div class="card-actions">

                    <button
                    class="edit-btn">

                        Edit

                    </button>

                    <button
                    class="delete-btn">

                        Delete

                    </button>

                </div>

                `

                : ""}

            `;


            // OPEN SUBJECTS PAGE

            branchCard.addEventListener(

                "click",

                () => {

                    localStorage.setItem(

                        "branchId",

                        branch._id

                    );

                    localStorage.setItem(

                        "branchName",

                        branch.branchName

                    );

                    window.location.href =
                    "subjects.html";

                }

            );


            // ADMIN CONTROLS

            if(role === "admin"){

                // EDIT BUTTON

                branchCard.querySelector(
                    ".edit-btn"
                )

                .addEventListener(

                    "click",

                    (e) => {

                        e.stopPropagation();

                        openEditModal(

                            branch._id,

                            branch.branchName

                        );

                    }

                );


                // DELETE BUTTON

                branchCard.querySelector(
                    ".delete-btn"
                )

                .addEventListener(

                    "click",

                    (e) => {

                        e.stopPropagation();

                        openDeletePopup(
                            branch._id
                        );

                    }

                );

            }


            branchContainer.appendChild(
                branchCard
            );

        });


        // ADMIN ADD CARD

        if(role === "admin"){

            const addCard =
            document.createElement(
                "div"
            );

            addCard.classList.add(
                "branch-card"
            );

            addCard.innerHTML = `

                <div class="add-icon">

                    +

                </div>

                <p>

                    Add Branch

                </p>

            `;


            addCard.addEventListener(

                "click",

                () => {

                    editMode = false;

                    branchInput.value = "";

                    modalTitle.innerText =
                    "Add Branch";

                    branchModal.classList.add(
                        "show"
                    );

                }

            );


            branchContainer.appendChild(
                addCard
            );

        }

    } catch(error){

        console.log(error);

    }

}

loadBranches();


// OPEN EDIT MODAL

function openEditModal(

    branchId,

    oldName

){

    editMode = true;

    selectedBranchId =
    branchId;

    branchInput.value =
    oldName;

    modalTitle.innerText =
    "Edit Branch";

    branchModal.classList.add(
        "show"
    );

}


// OPEN DELETE POPUP

function openDeletePopup(branchId){

    selectedBranchId =
    branchId;

    deletePopup.classList.add(
        "show"
    );

}


// SAVE BRANCH

saveModal

.addEventListener(

    "click",

    async () => {

        const branchName =
        branchInput.value.trim();

        if(!branchName) return;

        try {

            let response;


            // EDIT BRANCH

            if(editMode){

                response = await fetch(

                    `http://localhost:5000/api/branches/update/${selectedBranchId}`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                            "application/json",

                            Authorization:
                            `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            branchName

                        })

                    }

                );

            }


            // ADD BRANCH

            else {

                response = await fetch(

                    "http://localhost:5000/api/branches/add",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                            "application/json",

                            Authorization:
                            `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            branchName

                        })

                    }

                );

            }


            const data =
            await response.json();

            showAlert(
                data.message
            );

            branchModal.classList.remove(
                "show"
            );

            loadBranches();

        } catch(error){

            console.log(error);

        }

    }

);


// CANCEL MODAL

cancelModal

.addEventListener(

    "click",

    () => {

        branchModal.classList.remove(
            "show"
        );

    }

);


// CONFIRM DELETE

confirmDelete

.addEventListener(

    "click",

    async () => {

        try {

            const response = await fetch(

                `http://localhost:5000/api/branches/delete/${selectedBranchId}`,

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

            deletePopup.classList.remove(
                "show"
            );

            loadBranches();

        } catch(error){

            console.log(error);

        }

    }

);


// CANCEL DELETE

cancelDelete

.addEventListener(

    "click",

    () => {

        deletePopup.classList.remove(
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