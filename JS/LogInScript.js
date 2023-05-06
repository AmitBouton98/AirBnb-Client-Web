
function signInUser(user) {
    localStorage.setItem("userName", JSON.stringify(user))
    window.location.href = `../pages/home.html`
}

const showPassword = (inputID, eyeIcon) => {
    document.getElementById(inputID).type = document.getElementById(inputID).type == 'password' ? 'text' : 'password';
    eyeIcon.classList = eyeIcon.classList == 'fa-solid fa-eye' ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
}

$(document).ready(function () {
    
    // add click event listener for form buttons
    $('input[value="Back"]').click(() => showTheNeededSection("login"));
    $('input[value="Forget Password?"]').click(() => showTheNeededSection("forget"));
    $('input[value="REGISTER"]').click(() => showTheNeededSection("register"));

    // submit the login form
    $('#Plogin').submit(loadUser)
    $('#Pregister').submit(RegisterUser)
    $('#recoveryEmail').submit(() => resetPassword('resetpasswordEmail'))
    showTheNeededSection("login")
});

function showTheNeededSection(sectionName) {
    $('div[id="register"]').hide();
    $('div[id="login"]').hide();
    $('div[id="forget"]').hide();
    $('div[id="resetpasswordForm"]').hide();
    $(`div[id="${sectionName}"]`).show();
}

function clearAllInputs(formEl) {
    // this function will reset every input elemnt in the form
    formEl.reset()
}

function RegisterUser() {
    //showTheNeededSection("login")
    PostRegisterUser((data) => console.log(data))
    return false;
}
function loadUser() {
    PostloginUser(function (data) {
        swal.fire("Welcome to home page", "", "success");
        // add the indication for the user in the nav bar
        setTimeout(function () {
            signInUser(data);
        }, 1500); // 1.5 seconds delay
    }, $("#loginEmail").val(), $("#Loginpassword").val());
    return false;
}
function validatePhone() {
    const phoneInput = document.getElementById("PhoneRegister");
    const phoneValue = phoneInput.value.trim();
    if (phoneValue.length != 10 || !/^\d+$/.test(phoneValue)) {
        phoneInput.setCustomValidity("Please enter a valid phone number");
    } else {
        phoneInput.setCustomValidity("");
    }
}
// function validateId() {
//     const idInput = document.getElementById("IdRegister");
//     const idValue = idInput.value.trim();

//     if (idValue.length != 9 || !/^\d+$/.test(idValue)) {
//         idInput.setCustomValidity("Please enter a valid ID number");
//     } else {
//         idInput.setCustomValidity("");
//     }
// }

function validateEmail(id) {
    const emailInput = document.getElementById(id);
    const emailValue = emailInput.value.trim();

    if (emailValue === "") {
        emailInput.setCustomValidity("Please enter your email");
    } else if (!/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i.test(emailValue)) {
        emailInput.setCustomValidity("Please enter a valid email address");
    } else {
        emailInput.setCustomValidity("");
    }
}
function validatePassword(elem) {
    const passwordInput = elem;
    const passwordValue = passwordInput.value;
    const valditTexts = elem.parentElement.parentElement.querySelectorAll("ul li")
    if (passwordValue.length < 8) {
        passwordInput.setCustomValidity("Password must be at least 8 characters long");
        valditTexts[0].classList = "red"
    }
    else {
        valditTexts[0].classList = "green"
    }
    if (!/\d/.test(passwordValue)) {
        passwordInput.setCustomValidity("Password must contain at least one number");
        valditTexts[1].classList = "red"
    }
    else {
        valditTexts[1].classList = "green"
    }

    if (!/[a-z]/.test(passwordValue)) {
        passwordInput.setCustomValidity("Password must contain at least one lowercase letter");
        valditTexts[2].classList = "red"
    }
    else {
        valditTexts[2].classList = "green"

    }
    if (!/[A-Z]/.test(passwordValue)) {
        passwordInput.setCustomValidity("Password must contain at least one uppercase letter");
        valditTexts[3].classList = "red"
    }
    else {
        valditTexts[3].classList = "green"
    }
    if (!/\d/.test(passwordValue) || !/[a-z]/.test(passwordValue) || !/[A-Z]/.test(passwordValue || passwordValue.length < 8)) {

    }
    else {
        passwordInput.setCustomValidity("");
    }
}


function validateVerifyPassword() {
    const Password = document.getElementById("PasswordRegister").value;
    const verifyPassword = document.getElementById("Verifypassword").value;

    if (verifyPassword !== Password) {
        document.getElementById("Verifypassword").setCustomValidity("Passwords must match");
    } else {
        document.getElementById("Verifypassword").setCustomValidity("");
    }
}

function resetPassword(buttonId) {
    const emialEl = document.querySelector(`#${buttonId}`)

    document.querySelector("#userEmailWelcome").textContent  = emialEl.value
    getUserByEmail(emialEl.value, (data) => {
        swal.fire("Key sended to your email", "Check your spam email search from amit.khaled.airbnb", "success");
        showTheNeededSection("resetpasswordForm")
        // sending key and date and check if valid
        // console.log(document.querySelector(`#uniqueKey`).value)
        // console.log(new Date())
        $('#resetFormEl').submit(() => {
            RestPassCheck(document.querySelector(`#uniqueKey`).value, new Date(), data)
        })

        // console.log(data)
        // if (data != undefined) {
        //     Email.send({
        //         Host: "smtp.elasticemail.com",
        //         Username: "amit.khaled.airbnb@gmail.com",
        //         Password: "6BA88EB97CC6AE035885DC0CD3A95BB30CC8",
        //         To: emialEl.value,
        //         From: "amit.khaled.airbnb@gmail.com",
        //         Subject: "This message for resiteing your password in our webiste airbnb",
        //         Body: `
        //         <div>
        //         <h1>Hi , ${data.first} ${data.last}</h1>
        //         <p>This is your link for reseting your password dont forget to bring the uniquer code with you</p>
        //         your link is : <a href="${window.location.href.replace('index.html', '')}resetPassword.html?userEmail=${emialEl.value}">click</a>
        //         </div>`
        //     }).then(
        //         message => {
        //             if (message == 'OK') swal.fire("Recovery password email sended", "Check your spam email search for email from amit.khaled.airbnb", "success");
        //             else swal.fire("Recovery password email wasnt sended", "Please try again", "error");
        //         });
        //     emialEl.setAttribute('placeholder', 'Enter your email')
        //     emialEl.value = ""
        // }
        // else {
        //     emialEl.setAttribute('placeholder', 'Enter valide email')
        //     emialEl.value = ""
        //     errorNotEmailFound();
        // }
    })
    return false
}
function RestPassCheck(key, date, user) {
    // need to create call to server that send the key and date and check if its match
    // if its match in secuss call back function it does the changes (using update)
    // * we have the user here so we can use the update and change only the password
    //example :
    PostResetPassword((data) => { // checking for match     *need to create this funtion ins ServerJS
        console.log(data)
        user.password = document.querySelector(`#resetpasswordOne`).value
        UpdateUser((dat) => { // update the User if Match
            console.log(dat)
        }, user)
    })


    // PostResetPassword(userKeyEl.value, userNewPasswordEl.value, userIdEl.value)
    return false;
}




