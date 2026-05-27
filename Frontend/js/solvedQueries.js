const token =
localStorage.getItem(
    "token"
);

const role =
localStorage.getItem("role");

const adminBadge =
document.getElementById("adminBadge");

if(role === "admin" && adminBadge){

    adminBadge.innerText =
    "(ADMIN)";

}

async function loadSolvedQueries(){

    try {

        const response = await fetch(

            "https://aksupyq-backend.onrender.com/api/queries/all",

            {

                headers: {

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );

        const queries =
        await response.json();

        const queryContainer =
        document.getElementById(
            "queryContainer"
        );

        queryContainer.innerHTML = "";


        queries

        .filter(query =>

            query.isSolved

        )

        .forEach(query => {

            const queryCard =
            document.createElement("div");

            queryCard.classList.add(
                "query-card"
            );

            queryCard.innerHTML = `

                <h3>
                    ${query.user.name}
                </h3>

                <p>
                    ${query.user.email}
                </p>

                <p>
                    ${query.message}
                </p>

            `;

            queryContainer.appendChild(
                queryCard
            );

        });

    } catch(error){

        console.log(error);

    }

}

loadSolvedQueries();

// LOGOUT

document.getElementById("logoutbtn")

.addEventListener("click", () => {

    localStorage.clear();

    window.location.href =
    "login.html";

});