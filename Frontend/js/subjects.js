const subjectContainer =
document.getElementById("subjectContainer");

const branchId =
localStorage.getItem("branchId");

const branchName =
localStorage.getItem("branchName");

const token =
localStorage.getItem("token");


const role =
localStorage.getItem("role");

const adminBadge =
document.getElementById("adminBadge");

if(role === "admin" && adminBadge){

    adminBadge.innerText =
    "(ADMIN)";

}


// PROTECT PAGE

if(!token){

    window.location.href = "login.html";

}


// SHOW BRANCH TITLE

document.getElementById("branchTitle")
.innerText = `${branchName} Subjects`;


// LOAD SUBJECTS

async function loadSubjects(){

    try {

        const response = await fetch(

            `http://localhost:5000/api/subjects/${branchId}`

        );

        const subjects =
        await response.json();

        subjectContainer.innerHTML = "";

        // SHOW SUBJECTS

        subjects.forEach(subject => {

            const subjectCard =
            document.createElement("div");

            subjectCard.classList.add(
                "branch-card"
            );

            subjectCard.innerHTML = `

                <h3>
                    ${subject.subjectName}
                </h3>

            `;

            // CLICK SUBJECT

            subjectCard.addEventListener("click", () => {

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

            });

            subjectContainer.appendChild(
                subjectCard
            );

        });


        // ADMIN ADD SUBJECT CARD

        if(role === "admin"){

            const addCard =
            document.createElement("div");

            addCard.classList.add(
                "branch-card"
            );

            addCard.innerHTML = `

                <div class="add-icon">
                    +
                </div>

                <p>Add Subject</p>

            `;

            addCard.addEventListener("click", () => {

                const subjectName =
                prompt("Enter Subject Name");

                if(subjectName){

                    addSubject(subjectName);

                }

            });

            subjectContainer.appendChild(
                addCard
            );

        }

    } catch(error){

        console.log(error);

    }

}

loadSubjects();


// ADD SUBJECT

async function addSubject(subjectName){

    try {

        const response = await fetch(

            "http://localhost:5000/api/subjects/add",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json",

                    Authorization: token

                },

                body: JSON.stringify({

                    subjectName,
                    branchId

                })

            }

        );

        const data =
        await response.json();

        alert(data.message);

        loadSubjects();

    } catch(error){

        console.log(error);

    }

}


// LOGOUT

document.getElementById("logoutbtn")

.addEventListener("click", () => {

    localStorage.clear();

    window.location.href =
    "login.html";

});