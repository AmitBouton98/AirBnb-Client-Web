
const NUMBER_STARS = 5
let websiteUser;
function init(namePage) {
    if (localStorage.getItem('userName') == undefined) {
        window.location.href = `../pages/index.html`
        return;
    }
    // logging out
    $('#logoutButton').click(function () {
        localStorage.clear();
        // select all elements with the value "Back" and hide them
        window.location.href = `../pages/index.html`
    });
    // update details
    $('#UpdateDetailsButton').click(function () {
        UpdateDetails();
    });
    if (namePage === 'client') rendaer()
    document.querySelector("#userName").innerText = JSON.parse(localStorage.getItem("userName")).first + " " + JSON.parse(localStorage.getItem("userName")).last
    document.querySelector(".userImage img").setAttribute("src",JSON.parse(localStorage.getItem("userName")).profile_img)

}


function rendaer() {
    $(".appartmentSlider").ready(()=>{
         const loader = document.querySelector(".loader")
        loader.classList.add("loader-hidden")
        loader.addEventListener("transitioned",()=>{
        document.body.removeChild("loadre");
    })
    })
    Arr.forEach(f => {
        createCard(f, "appartmentSlider");
    })
}

function signInUser(user) {
    localStorage.setItem("userName", JSON.stringify(user.first + " " + user.last))
    window.location.href = `../pages/home.html`
}

function createCard(flat) {
    const card = createElemnt("div", "card");
    card.classList.add("flip-card")
    const cardInner = createElemnt("div", "flip-card-inner")
    const cardFront = createElemnt("div", "flip-card-front")
    const cardBack = createElemnt("div", "flip-card-back")
    //create img sectinon 
    const imgSection = createElemnt("section", "imgSection");
    const img = createElemnt("img");
    img.setAttribute("src", flat["picture_url"])
    imgSection.appendChild(img);

    //create textSection
    const textSection = createElemnt("section", "textSection");
    const appartmentName = createElemnt("h2", "name");
    appartmentName.innerText = flat["name"]

    //create ratingSection sub section in text
    const reateingSection = createElemnt("section", "reatingSection");
    reateingSection.innerHTML = `Rating: ${flat["review_scores_rating"] ?? 0}`
    const barReview = createElemnt("div", "barReview");
    reateingSection.appendChild(barReview)
    createStars(barReview, flat["review_scores_rating"] ?? 0);

    //create desctioption 
    const description = createElemnt("p", "description");
    description.innerHTML = flat["description"]
    //create addtionINFO
    const additionInfo = createElemnt("p", "", "", "additionInfo")
    additionInfo.innerText = `City : Amsterdam, Neighbourhood : ${flat["neighbourhood"] ?? "MISS DATA"}`
    //create the footer 
    const footer = createElemnt("footer");
    const roomNumberPara = createElemnt("p")
    const roomNumberSpan = createElemnt("span", "", flat["bedrooms"], "number-rooms")
    roomNumberPara.innerHTML = "Bed rooms: ";
    roomNumberPara.appendChild(roomNumberSpan)
    const pricePara = createElemnt("p")
    pricePara.innerText = "Price: "
    const priceSpan = createElemnt("span", "", String(flat["price"]).includes('$') ? flat["price"] : `$${flat["price"]}`, "price")
    pricePara.appendChild(priceSpan)

    const inputButtonAdd = createElemnt("input", "", "", `ID${flat["id"]}`);
    inputButtonAdd.setAttribute("type", "button")
    inputButtonAdd.setAttribute("value", "Add an appartment")
    inputButtonAdd.onclick = function clicked() {
        addAppartment(this.id)
    }
    const dateSection = createElemnt("section", "flip-card-back");

    //add elents and compainy togther
    appendListOfChilds(textSection, appartmentName, reateingSection, description, additionInfo, footer);
    appendListOfChilds(footer, roomNumberPara, pricePara, inputButtonAdd);
    appendListOfChilds(cardFront, imgSection, textSection)
    appendListOfChilds(cardBack, dateSection)
    appendListOfChilds(cardInner, cardFront, cardBack)
    appendListOfChilds(card, cardInner);
    appendListOfChilds(document.querySelector(".appartmentSlider"), card);

}


function createElemnt(type, classes = "", data = "", id = "") {
    const elm = document.createElement(type);
    elm.innerText = data;
    if (classes != "")
        elm.classList.add(classes);
    elm.id = id;
    return elm;
}
function createStars(parent, rating) {
    parent.innerHTML = `<i class="fa-solid fa-star"></i>`.repeat(NUMBER_STARS)
    const percent = (rating / 5) * 100;
    parent.style.backgroundImage = `linear-gradient(90deg, yellow 0%, yellow ${percent}%,rgba(255,255,255,0.2) ${percent}% , rgba(255,255,255,0.5) 100%)`
}
function appendListOfChilds(parent = document.body, ...args) {
    args.forEach(x => parent.appendChild(x));
}

function addAppartment(flatId) {
    sendToServer(flatId)
}

// function popMessage(title,text) {
//     //swal.fire(title, text, "success");

//     const messageBox = createElemnt("div","","","messageBox");
//     const messageTitle = createElemnt("h2");
//     messageTitle.innerText = title;
//     const messageContent = createElemnt("p");
//     messageContent.innerText = text;
//     appendListOfChilds(messageBox,messageTitle,messageContent);
//     document.body.appendChild(messageBox)

//     const appartemntSection =  document.querySelector(".appartmentSlider");
//     appartemntSection.style.opacity = 0.5
//     setTimeout(()=>{
//         messageBox.remove();
//         appartemntSection.style.opacity = 1;
//     },1000);
// }

function Search() {
    //delet all
    document.querySelector(".appartmentSlider").innerHTML = ""
    const searchParamater1 = document.querySelector("#price").value
    const searchParamater2 = document.querySelector("#rating").value
    Arr.forEach(f => {
        let price = searchParamater1 == "" ? parseFloat(f["price"].substring(1)) : parseFloat(searchParamater1);
        let rating = searchParamater2 == "" ? parseFloat(f["review_scores_rating"]) : parseFloat(searchParamater2);
        // check if the price is lower or equal and if the rating is above or equal
        if ((f["price"].substring(1).replace("/[^0-9]/g", "")) <= price && parseFloat(f["review_scores_rating"]) >= rating) {
            createCard(f);
        }
    })
}

function addDeleteButton() {
    const cardsBtnSection = document.querySelectorAll(".card .textSection footer input")
    cardsBtnSection.forEach(inputBtn => {
        inputBtn.setAttribute("value", "Delete")
        inputBtn.onclick = function clicked() {
            delAppartmentFromServer(this.id.substring(2))
            this.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
        }
    })
}
function addBookButton() {
    const cardsBtnSection = document.querySelectorAll(".card .textSection footer input")
    cardsBtnSection.forEach(inputBtn => {
        const elem = createElemnt("input", "", "", `Flat${inputBtn.id.substring(2)}`)
        elem.setAttribute("value", "Book")
        elem.setAttribute("type", "button")
        inputBtn.parentElement.appendChild(elem);
        elem.onclick = function clicked() {
            ShowPickRangeOfDates(this, "", PostOrder)
            // bookAppartment(this.id.substring(2))
            // this.parentElement.parentElement.parentElement.remove()
        }
    })
}

document.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
        document.querySelector(".navBar").classList.add('scrolled')
    }
    else {
        document.querySelector(".navBar").classList.remove('scrolled')
    }
})

function UpdateDetails() {
    Swal.fire({
        title: "Update Details",
        html:
            `
            <div  class="UserUpdateContainer">
                <label for="name-input">first Name: </label>
                <input type="text" id="first-input" value="${JSON.parse(localStorage.getItem("userName")).first}" required>
            </div>
            <div  class="UserUpdateContainer">
                <label for="age-input">last name: </label>
                <input type="text" id="last-input" value="${JSON.parse(localStorage.getItem("userName")).last}" required>
            </div>
            <div  class="UserUpdateContainer">
                <label for="age-input">phone number: </label>
                <input type="text" id="phone-input" value="${JSON.parse(localStorage.getItem("userName")).phoneNumber}" required>
            </div>
            <div  class="UserUpdateContainer">
                <label for="age-input">country: </label>
                <input type="text" id="country-input" value="${JSON.parse(localStorage.getItem("userName")).country}" required>
            </div>
            <div  class="UserUpdateContainer">
                <label for="age-input">email: </label>
                <input type="text" id="email-input" value="${JSON.parse(localStorage.getItem("userName")).email}" required>
            </div>
            <div  class="UserUpdateContainer">
                <label for="age-input">password: </label>
                <input type="text" id="password-input" value="${JSON.parse(localStorage.getItem("userName")).password}" required>
            </div>
          
          `,
        focusConfirm: false,
        preConfirm: () => {
            const first = $("#first-input").val();
            const last = $("#last-input").val();
            const phoneNumber = $("#phone-input").val();
            const country = $("#country-input").val();
            const email = $("#email-input").val();
            const password = $("#password-input").val();
            if (!first || !last || !phoneNumber || !country || !email || !password) {
                Swal.showValidationMessage(`Please fill all the fields`);
            } else if (phoneNumber.length != 10 || !/^\d+$/.test(phoneNumber)) {
                Swal.showValidationMessage("Please enter a valid phone number");
            } else if (!/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i.test(email)) {
                Swal.showValidationMessage("Please enter a valid email address");
            } else if (password.length < 8) {
                Swal.showValidationMessage("Password must be at least 8 characters long");
            } else if (!/\d/.test(password)) {
                Swal.showValidationMessage("Password must contain at least one number");
            } else if (!/[a-z]/.test(password)) {
                Swal.showValidationMessage("Password must contain at least one lowercase letter");
            } else if (!/[A-Z]/.test(password)) {
                Swal.showValidationMessage("Password must contain at least one uppercase letter");
            }
            else {
                return {
                    first,
                    last,
                    id: JSON.parse(localStorage.getItem("userName")).id,
                    country,
                    email,
                    password,
                    phoneNumber,
                    profile_img : JSON.parse(localStorage.getItem("userName")).profile_img
                };
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const userInput = result.value;
            // console.log(userInput);
            UpdateUser((data) => {
                localStorage.setItem("userName", JSON.stringify(userInput))
                setTimeout(function () {
                    window.location.reload();
                }, 1000); // 1 seconds delay
            }, userInput)

        }
    });
}
