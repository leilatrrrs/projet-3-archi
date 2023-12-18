const userEmail = document.getElementById("email")
const userPassword = document.getElementById("password")
const loginFormulaire = document.getElementById("login")
const errorMessage = document.getElementById("error-message")

   
const chargeUtile = JSON.stringify({email : userEmail.value, password : userPassword.value}) /* Données qui vont être envoyé au serveur */

 const response = await fetch("http://localhost:5678/api/users/login", { /* envoi des données du formulaire ver l'Api via fetch */
        method:'POST',
        headers: {"Content-Type": "application/json"},
        body: chargeUtile
        })

localStorage.setItem("token", response.token)
console.log("cest le :", respnse.token )

    loginFormulaire.addEventListener('submit', async function (e){
    e.preventDefault()}/* empeche que la page se recharge */


        const loginResult = await response.json()
        if (response.ok) {
            localStorage.setItem("token", loginResult.token)
window.location.href = "index.html"; 
}


