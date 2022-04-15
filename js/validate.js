//Manejando elementos con Query Selector
const formulario = document.querySelector("#formulario-contacto");
const botonEnviar = document.querySelector(".btn-enviar");

//Manejando elementos con Get Element
const nameContact = document.getElementsByName("name_contact")[0];
const email = document.getElementsByName("email_contact")[0];
const phone = document.getElementsByName("phone_contact")[0];
const topic = document.getElementById("topic-contact");
const commit = document.getElementsByName("commit_contact")[0];

//Mensajes de error
const errorsList = document.getElementById("errors");

function showError(element, message) {
    element.classList.toggle("error");
    alert(message);
    // errorsList.innerHTML += `<li>${message}</li>`;
}

// function cleanErrors() {
//     errorsList.innerHTML = '';
// }

/* 5. Enviar petición a la API entregada en clase 
    (https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email) 
    usando fetch*/
    async function sendEmail(name, email, phone, select, comment){
        const rawResponse = await fetch('https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email', {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-type': 'aplication/json'
            },
            body: JSON.stringify({name, email, phone, select, comment})  
        });
        const content = await rawResponse.json();
        if (Object.keys(content.errors).length < 0) {
            alert("Error a enviar los datos del formulario");
        }else{
            alert("Correo enviado satisfactoriamente");
        }
    }

//Validacion de los elementos
botonEnviar.addEventListener("click", (event) => {
    event.preventDefault();
    // cleanErrors();
    let hasErrors = false;
    
    //1. Campo nombre y apellido no debe estar vacío y contener al menos un espacio.
    const sanitizedName = nameContact.value.trim();
    if (sanitizedName.length === 0 || sanitizedName.indexOf(' ') < 0) {
        showError(nameContact, "Ingrese nombres y apellidos por favor");
        hasErrors = true;
    }

    //2. Campo correo debe tener un correo válido.
    const mailRe = /^\w+@\w+\.\w{2,7}$/;
    if (!mailRe.exec(email.value)) {
        showError(email, "El correo debe seguir un formato válido.");
        hasErrors = true;
    }

    /*3. Campo número de teléfono debe tener entre 7 y 15 dígitos, pudiendo tener un 
    + al inicio, ignorando espacios en blanco.*/
    const phoneRe = /^\+?\d{7,15}$/;
    const sanitizedPhone = phone.value.replace(" ", "");
    if (!phoneRe.exec(sanitizedPhone)) {
        showError(phone, "Número de teléfono debe tener entre 7 y 15 dígitos.");
        hasErrors = true;
    }

    // 4. Campo comentario debe tener al menos 20 caracteres.
    const sanitizedCommit = commit.value.trim();
    if (sanitizedCommit.length < 20) {
        showError(commit, "El comentario debe tener al menos 20 caracteres");
        hasErrors = true;
    }

    //Enviando a la API
    if (!hasErrors) {
        sendEmail(sanitizedName, email.value ,sanitizedPhone,topic.value, sanitizedCommit);
    }

});