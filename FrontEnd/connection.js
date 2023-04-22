
document.querySelector("#formulaire_de_connection").addEventListener("submit", function (event) {
    const dataLogin = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value
    }
    event.preventDefault();
   
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataLogin)
    })
                                
    .then(function (reponse) {
        if (reponse.ok) {
            reponse.json()
            .then(data => {
                console.log("dataToken : "+data.token);
               
                sessionStorage.setItem('adminToken', data.token)
                sessionStorage.setItem('adminId', data.userId)

                window.location.href="index.html" 
            })
           
            .catch(error => {
                console.log(error);
            });
        } else {
            alert("identification ou mot de passe erroné");
        }
    })
    .catch(error => {
        console.log(error);
    });
});






