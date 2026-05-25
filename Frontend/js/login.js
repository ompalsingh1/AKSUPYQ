const customAlert =
    document.getElementById(
        "customAlert"
    );

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(

    "submit",

    async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        try {

            const response = await fetch(

                "http://localhost:5000/api/auth/login",

                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })

                }

            );

            const data =
                await response.json();

            if (response.ok) {

                // SAVE TOKEN

                localStorage.setItem(
                    "token",
                    data.token
                );

                // SAVE ROLE

                localStorage.setItem(
                    "role",
                    data.role
                );

                showAlert(data.message);

                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 2000);

            } else {

                showAlert(data.message);

            }

        } catch (error) {

            console.log(error);

        }

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

    }, 500);

}