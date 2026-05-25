const subjectContainer =
document.getElementById(
    "subjectContainer"
);

const branchId =
localStorage.getItem(
    "branchId"
);

const branchName =
localStorage.getItem(
    "branchName"
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

const subjectModal =
document.getElementById(
    "subjectModal"
);

const deletePopup =
document.getElementById(
    "deletePopup"
);

const subjectInput =
document.getElementById(
    "subjectInput"
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

let selectedSubjectId = null;


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


// SHOW TITLE

document.getElementById(
    "branchTitle"
)

.innerText =
`${branchName} Subjects`;


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


// LOAD SUBJECTS

async function loadSubjects(){

    try {

        const response = await fetch(

            `http://localhost:5000/api/subjects/${branchId}`

        );

        const subjects =
        await response.json();

        subjectContainer.innerHTML =
        "";


        // SHOW SUBJECTS

        subjects.forEach(subject => {

            const subjectCard =
            document.createElement(
                "div"
            );

            subjectCard.classList.add(
                "branch-card"
            );


            subjectCard.innerHTML = `

                <h3>
                    ${subject.subjectName}
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


            // OPEN PAPERS PAGE

            subjectCard.addEventListener(

                "click",

                () => {

                    localStorage.setItem(

                        "subjectId",

                        subject._id

                    );

                    localStorage.setItem(

                        "subjectName",

                        subject.subjectName

                    );

                    window.location.href =
                    "papers.html";

                }

            );


            // ADMIN CONTROLS

            if(role === "admin"){

                // EDIT

                subjectCard.querySelector(
                    ".edit-btn"
                )

                .addEventListener(

                    "click",

                    (e) => {

                        e.stopPropagation();

                        openEditModal(

                            subject._id,

                            subject.subjectName

                        );

                    }

                );


                // DELETE

                subjectCard.querySelector(
                    ".delete-btn"
                )

                .addEventListener(

                    "click",

                    (e) => {

                        e.stopPropagation();

                        openDeletePopup(
                            subject._id
                        );

                    }

                );

            }


            subjectContainer.appendChild(
                subjectCard
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

                    Add Subject

                </p>

            `;


            addCard.addEventListener(

                "click",

                () => {

                    editMode = false;

                    subjectInput.value = "";

                    modalTitle.innerText =
                    "Add Subject";

                    subjectModal.classList.add(
                        "show"
                    );

                }

            );


            subjectContainer.appendChild(
                addCard
            );

        }

    } catch(error){

        console.log(error);

    }

}

loadSubjects();


// OPEN EDIT MODAL

function openEditModal(

    subjectId,

    oldName

){

    editMode = true;

    selectedSubjectId =
    subjectId;

    subjectInput.value =
    oldName;

    modalTitle.innerText =
    "Edit Subject";

    subjectModal.classList.add(
        "show"
    );

}


// OPEN DELETE POPUP

function openDeletePopup(subjectId){

    selectedSubjectId =
    subjectId;

    deletePopup.classList.add(
        "show"
    );

}


// SAVE SUBJECT

saveModal

.addEventListener(

    "click",

    async () => {

        const subjectName =
        subjectInput.value.trim();

        if(!subjectName) return;

        try {

            let response;


            // EDIT SUBJECT

            if(editMode){

                response = await fetch(

                    `http://localhost:5000/api/subjects/update/${selectedSubjectId}`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                            "application/json",

                            Authorization:
                            `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            subjectName

                        })

                    }

                );

            }


            // ADD SUBJECT

            else {

                response = await fetch(

                    "http://localhost:5000/api/subjects/add",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                            "application/json",

                            Authorization:
                            `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            subjectName,

                            branchId

                        })

                    }

                );

            }


            const data =
            await response.json();

            showAlert(
                data.message
            );

            subjectModal.classList.remove(
                "show"
            );

            loadSubjects();

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

        subjectModal.classList.remove(
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

                `http://localhost:5000/api/subjects/delete/${selectedSubjectId}`,

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

            loadSubjects();

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