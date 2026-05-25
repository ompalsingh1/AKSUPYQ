const paperContainer =
    document.getElementById("paperContainer");

const subjectId =
    localStorage.getItem("subjectId");

const subjectName =
    localStorage.getItem("subjectName");

const token =
    localStorage.getItem("token");

const role =
    localStorage.getItem("role");

const adminBadge =
    document.getElementById("adminBadge");

if (role === "admin" && adminBadge) {

    adminBadge.innerText =
        "(ADMIN)";

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


// MODAL ELEMENTS

const uploadModal =
    document.getElementById("uploadModal");

const closeModal =
    document.getElementById("closeModal");

const uploadForm =
    document.getElementById("uploadForm");


// PROTECT PAGE

if (!token) {

    window.location.href = "login.html";

}


// SHOW SUBJECT TITLE

document.getElementById("subjectTitle")
    .innerText = `${subjectName} Papers`;


// LOAD PAPERS

async function loadPapers() {

    try {

        const response = await fetch(

            `http://localhost:5000/api/papers/${subjectId}`

        );

        const papers =
            await response.json();
        // SORT PAPERS DESCENDING BY YEAR

        papers.sort((a, b) => b.year - a.year);

        paperContainer.innerHTML = "";



        // SHOW PAPERS

        papers.forEach(paper => {

            const paperCard =
                document.createElement("div");

            paperCard.classList.add(
                "branch-card"
            );

            paperCard.innerHTML = `

                <h3>
                    ${paper.paperName}
                </h3>

                <p>
                    Year : ${paper.year}
                </p>

                <div class="paper-buttons">

                    <button class="download-btn">

                        Download

                    </button>

                    ${role === "admin"

                    ?

                    `

                        <button
                        class="delete-btn">

                            Delete

                        </button>

                        `

                    :

                    ""

                }

                </div>

            `;



            // DOWNLOAD PAPER

            paperCard.querySelector(
                ".download-btn"
            )

                .addEventListener("click", async () => {

                    try {

                        const response = await fetch(

                            `http://localhost:5000/api/papers/download/${paper._id}`,

                            {

                                headers: {
                                    Authorization: token
                                }

                            }

                        );

                        if (!response.ok) {

                            throw new Error(
                                "Download failed"
                            );

                        }

                        const blob =
                            await response.blob();

                        const url =
                            window.URL.createObjectURL(blob);

                        const a =
                            document.createElement("a");

                        a.href = url;

                        a.download =
                            `${paper.paperName}.pdf`;

                        document.body.appendChild(a);

                        a.click();

                        a.remove();

                        window.URL.revokeObjectURL(url);

                    } catch (error) {

                        console.log(error);

                    }

                });



            // DELETE PAPER

            if (role === "admin") {

                paperCard.querySelector(
                    ".delete-btn"
                )

                    .addEventListener("click", () => {

                        deletePaper(
                            paper._id
                        );

                    });

            }


            paperContainer.appendChild(
                paperCard
            );

        });



        // ADMIN UPLOAD CARD

        if (role === "admin") {

            const uploadCard =
                document.createElement("div");

            uploadCard.classList.add(
                "branch-card"
            );

            uploadCard.innerHTML = `

                <div class="add-icon">

                    +

                </div>

                <p>
                    Upload Paper
                </p>

            `;


            uploadCard.addEventListener("click", () => {

                uploadModal.style.display =
                    "flex";

            });


            paperContainer.appendChild(
                uploadCard
            );

        }

    } catch (error) {

        console.log(error);

    }

}

loadPapers();




// CLOSE MODAL

closeModal.addEventListener("click", () => {

    uploadModal.style.display =
        "none";

});




// UPLOAD PAPER

uploadForm.addEventListener(

    "submit",

    async (e) => {

        e.preventDefault();

        const formData = new FormData();


        formData.append(

            "paperName",

            document.getElementById(
                "paperName"
            ).value

        );


        formData.append(

            "year",

            document.getElementById(
                "year"
            ).value

        );


        formData.append(
            "subjectId",
            subjectId
        );


        formData.append(

            "pdf",

            document.getElementById(
                "pdfFile"
            ).files[0]

        );


        try {

            const response = await fetch(

                "http://localhost:5000/api/papers/upload",

                {

                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: formData

                }

            );

            const data =
                await response.json();

            showAlert(data.message);

            uploadModal.style.display =
                "none";

            uploadForm.reset();

            loadPapers();

        } catch (error) {

            console.log(error);

        }

    }

);




// DELETE PAPER

function deletePaper(paperId) {

    selectedPaperId =
        paperId;

    customPopup.classList.add(
        "show"
    );

}

// CONFIRM DELETE

confirmDeleteBtn

    .addEventListener(

        "click",

        async () => {

            try {

                const response =
                    await fetch(

                        `http://localhost:5000/api/papers/delete/${selectedPaperId}`,

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

                loadPapers();

            } catch (error) {

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

    }, 2000);

}




// LOGOUT

document.getElementById("logoutbtn")

    .addEventListener("click", () => {

        localStorage.clear();

        window.location.href =
            "login.html";

    }); 