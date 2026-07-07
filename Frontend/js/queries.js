const token =
    localStorage.getItem("token");

const role =
    localStorage.getItem("role");

const customAlert =
    document.getElementById(
        "customAlert"
    );


const adminBadge =
    document.getElementById("adminBadge");

if (role === "admin" && adminBadge) {

    adminBadge.innerText =
        "(ADMIN)";

}

const querySection =
    document.getElementById(
        "querySection"
    );

if (role === "admin" && querySection) {

    querySection.style.display =
        "none";

}

const solvedQueriesBtn =
    document.getElementById(
        "solvedQueriesBtn"
    );

if (role !== "admin" && solvedQueriesBtn) {

    solvedQueriesBtn.style.display =
        "none";

}

function showAlert(message) {

    customAlert.innerText =
        message;

    customAlert.classList.add(
        "show"
    );

    setTimeout(() => {

        customAlert.classList.remove(
            "show"
        );

    }, 1000);

}

// PROTECT PAGE

if (!token) {

    window.location.href =
        "login.html";

}


// SEND QUERY

document.getElementById("queryForm")

    .addEventListener(

        "submit",

        async (e) => {

            e.preventDefault();

            console.log("Submitting Query");


            const message =
                document.getElementById(
                    "message"
                ).value;

            try {

                const response = await fetch(

                    "https://aksupyq-backend.onrender.com/api/queries/send",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({
                            message
                        })

                    }

                );

                const data =
                    await response.json();

                showAlert(data.message);

                document.getElementById(
                    "queryForm"
                ).reset();
                loadQueries();

            } catch (error) {

                console.log(error);

            }

        }

    );


// LOAD QUERIES

async function loadQueries() {

    try {

        let apiUrl = "";


        // ADMIN

        if (role === "admin") {

            apiUrl =
                "https://aksupyq-backend.onrender.com/api/queries/all";

        }

        // USER

        else {

            apiUrl =
                "https://aksupyq-backend.onrender.com/api/queries/myqueries";

        }


        const response = await fetch(

            apiUrl,

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


        // ADMIN VIEW

        if (role === "admin") {

            const UnsolvedQueries = queries.filter(query => !query.isSolved);

            if (UnsolvedQueries.length === 0) {
                queryContainer.innerHTML = `
        <div class="empty-state">
            <h3>No Pending Queries</h3>
            <p>All user queries have been solved.</p>
        </div>
    `;
                return;
            }



            UnsolvedQueries.forEach(query => {

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

                    <button
                    class="delete-query">

                        Delete

                    </button>

                    <button
                    class="solve-query">

                        Solved

                    </button>

                `;


                // DELETE

                queryCard.querySelector(
                    ".delete-query"
                )

                    .addEventListener(

                        "click",

                        () => {

                            deleteQuery(
                                query._id
                            );

                        }

                    );


                // SOLVE

                queryCard.querySelector(
                    ".solve-query"
                )

                    .addEventListener(

                        "click",

                        () => {

                            solveQuery(
                                query._id
                            );

                        }

                    );


                queryContainer.appendChild(
                    queryCard
                );

            });

        }


        // USER VIEW

        else {

            if (queries.length === 0) {
                queryContainer.innerHTML = `
        <div class="empty-state">
            <h3>No Queries Yet</h3>
            <p>You haven't submitted any queries yet.</p>
        </div>
    `;
                return;
            }

            queries.forEach(query => {

                const queryCard =
                    document.createElement("div");

                queryCard.classList.add(
                    "query-card"
                );


                // SOLVED

                if (query.isSolved) {

                    queryCard.classList.add(
                        "solved-query-card"
                    );

                }

                // UNSOLVED

                else {

                    queryCard.classList.add(
                        "unsolved-query-card"
                    );

                }


                queryCard.innerHTML = `

                    <p>
                        ${query.message}
                    </p>

                    <span>

                        ${query.isSolved

                        ? "Solved"

                        : "Pending"}

                    </span>

                `;

                queryContainer.appendChild(
                    queryCard
                );

            });

        }

    } catch (error) {

        console.log(error);

    }

}

loadQueries();


// DELETE QUERY

async function deleteQuery(queryId) {

    try {

        const response = await fetch(

            `https://aksupyq-backend.onrender.com/api/queries/delete/${queryId}`,

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

        loadQueries();

    } catch (error) {

        console.log(error);

    }

}

// SOLVE QUERY

async function solveQuery(queryId) {

    try {

        const response = await fetch(

            `https://aksupyq-backend.onrender.com/api/queries/solve/${queryId}`,

            {

                method: "PUT",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        const data =
            await response.json();

        showAlert(data.message);

        loadQueries();

    } catch (error) {

        console.log(error);

    }

}


// LOGOUT

const logoutBtn =
    document.getElementById("logoutbtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href =
            "login.html";

    });

}