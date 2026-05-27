const customAlert =
    document.getElementById(
        "customAlert"
    );
    
    const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try {

        const response = await fetch(

            "https://aksupyq-backend.onrender.com/api/auth/register",

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            }

        );

        const data = await response.json();

        if(response.ok){

            showAlert("Registration successful!");

                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 1000);

        } else {

            showAlert(data.message);

        }

    } catch(error){

        console.log(error);

    }

});

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

    }, 1000);

}