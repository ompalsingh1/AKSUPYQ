const branchContainer =
document.getElementById("branchContainer");

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


// LOAD BRANCHES

async function loadBranches(){

    try {

        const response = await fetch(
            "http://localhost:5000/api/branches"
        );

        const branches = await response.json();

        branchContainer.innerHTML = "";

        // SHOW BRANCHES

        branches.forEach(branch => {

            const branchCard =
            document.createElement("div");

            branchCard.classList.add("branch-card");

            branchCard.innerHTML = `

                <h3>${branch.branchName}</h3>

            `;

            // CLICK BRANCH

            branchCard.addEventListener("click", () => {

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

            });

            branchContainer.appendChild(
                branchCard
            );

        });


        // ADMIN ADD BRANCH CARD

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

                <p>Add Branch</p>

            `;

            addCard.addEventListener("click", () => {

                const branchName =
                prompt("Enter Branch Name");

                if(branchName){

                    addBranch(branchName);

                }

            });

            branchContainer.appendChild(
                addCard
            );

        }

    } catch(error){

        console.log(error);

    }

}

loadBranches();


// ADD BRANCH

async function addBranch(branchName){

    try {

        const response = await fetch(

            "http://localhost:5000/api/branches/add",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json",

                    Authorization: token

                },

                body: JSON.stringify({
                    branchName
                })

            }

        );

        const data =
        await response.json();

        alert(data.message);

        loadBranches();

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