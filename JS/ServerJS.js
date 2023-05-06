// const api = "https://proj.ruppin.ac.il/cgroup17/test2/tar1/api"
const api = "https://localhost:7297/api"
function getFromServer(callback) {
    ajaxCall("GET", `${api}/Flats/Get?id=${JSON.parse(localStorage.getItem("userName")).id}`, "", function (data) {
        successMannagerCB(["Load", data]);
        callback(data);
    }, errorCB);
    return false;
}
function getUserByEmail(email, callback) {
    ajaxCall("GET", `${api}/WebUsers/GetByemail/email/${email}/`, "", function (data) {
        callback(data)
    }, errorNotEmailFound);
    return false;
}

function getFromServerByPrice(callback, price) {
    ajaxCall("GET", `${api}/Flats/GetByPrice?price=${price}&id=${JSON.parse(localStorage.getItem("userName")).id}`, "", function (data) {
        successMannagerCB(["Load", data]);
        callback(data);
    }, errorCB);
    return false;
}
function getFromServerByRating(callback, rating) {
    ajaxCall("GET", `${api}/Flats/GetByCityRating/rating/${rating}/id/${JSON.parse(localStorage.getItem("userName")).id}`, "", function (data) {
        successMannagerCB(["Load", data]);
        callback(data);
    }, errorCB);
    return false;
}

function delAppartmentFromServer(id) {
    ajaxCall("Delete", `${api}/Flats/${id}`, "", data => successMannagerCB(["Delete", data]), errorCB);
    return false;
}
function bookAppartment(id) {
    ajaxCall("Delete", `${api}/Flats/${id}`, "", data => successMannagerCB(["Delete", data]), errorCB);
    return false;
}
function PostloginUser(callback, email, password) {
    ajaxCall("POST", `${api}/WebUsers/LogInPost?email=${email}&password=${password}`, "", function (data) {
        callback(data);
    }, errorLG);
    // to prevent refreshing the page evrey time 
    return false;
}

function PostResetPassword(callback, key, id) {
    ajaxCall("GET", `${api}/WebUsers/CheckIfKeyCorrect?key=${key}&id=${id}`, "", function (data) {
        swal.fire("Changed Sucsessfully!", "", "success");
        callback(data)
    }, errorCB);
    return false;
}
function PostRegisterUser(callback) {

    var radios = document.getElementsByName('avatar');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            radios = radios[i].value
            break;
        }
    }
    NewUser = {
        first: $("#FirstRegister").val(),
        last: $("#LastRegister").val(),
        id: "",
        country: $("#CountryRegister").val(),
        email: $("#EmailRegister").val(),
        password: $("#PasswordRegister").val(),
        PhoneNumber: $("#PhoneRegister").val(),
        Profile_img: radios
    }
    ajaxCall("POST", `${api}/WebUsers`, JSON.stringify(NewUser), function (data) {
        swal.fire("Registered to the server!", "Great Job", "success");
        setTimeout(function () {
            signInUser(data);
            //signInUser(NewUser);
        }, 1500); // 1.5 seconds delay
        callback(data);
    }, errorRG);
    // to prevent refreshing the page evrey time 
    return false;
}
// function PostResetPassword(key, newpassword, id) {
//     console.log(newpassword)
//     ajaxCall("POST", `${api}/WebUsers/ResetPassword?id=${id}&key=${key}&newPassword=${newpassword}`, '', function (data) {
//         console.log(data)
//         if (data) {
//             const resetFormEl = $("#resetpasswordForm")
//             resetFormEl.remove()
//             swal.fire(
//                 {
//                     icon: 'success',
//                     title: 'Reset password succsefuly',
//                     text: "Great Job",
//                     showConfirmButton: true,
//                     position: 'center'
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         window.close()
//                     }
//                 })
//         } else {
//             swal.fire(
//                 {
//                     icon: 'error',
//                     title: 'something went worng!!',
//                     text: "Bad Job",
//                     showConfirmButton: true,
//                     position: 'center'

//                 });
//         }
//     },
//         () => swal.fire(
//             {
//                 icon: 'error',
//                 title: 'something went worng!',
//                 text: "Bad Job",
//                 showConfirmButton: true,
//                 position: 'center'

//             }

//         ));
//     return false;
// }
function getOrdersById(userId, callback) {
    ajaxCall("Get", `${api}/Orders/GetByUserId?userId=${userId}`, "", function (data) {
        //swal.fire("Update Sucsessfully!", "", "success");
        callback(data);
    }, errorRG);
    return false;
}
async function getFlatById(flatId, callback = "") {


    return new Promise((resolve, reject) => {
        ajaxCall("Get", `${api}/Flats/${flatId}`, "", flat => {
            resolve(flat);
        }, error => {
            reject(error);
        });
    });

}

function sendToServer(flatId) {
    Arr.forEach(appartment => {
        if (appartment["id"] == flatId.substring(2)) {
            let str = appartment["price"];
            str = str.substring(1); // remove the first character ('$')
            str = str.trim(); // remove any leading/trailing whitespace
            newFlat = {
                userId: JSON.parse(localStorage.getItem("userName")).id,
                id: appartment["id"],
                //City: "Amsterdam",
                // need to check neighbourhood
                neighbourhood: appartment["host_neighbourhood"],
                price: str,
                bedrooms: appartment["bedrooms"],
                picture_url: appartment["picture_url"],
                description: appartment["description"],
                name: appartment["name"],
                review_scores_rating: appartment["review_scores_rating"]
            }
            ajaxCall("POST", `${api}/Flats/`, JSON.stringify(newFlat), successClinetCB, errorCB);
        }
    })
    return false;
}
function PostOrder(callback, UserId, FlatId, StartDate, EndDate, PricePerNight) {
    StartDate = new Date(StartDate)
    EndDate = new Date(EndDate)
    StartDate.setDate(StartDate.getDate() + 1);
    EndDate.setDate(EndDate.getDate() + 1);
    NewOrder = {
        id: 0,
        userId: parseInt(UserId),
        flatId: parseInt(FlatId),
        startDate: StartDate,
        endDate: EndDate,
        pricePerNight: parseInt(PricePerNight)
    }
    ajaxCall("POST", `${api}/Orders`, JSON.stringify(NewOrder), function (data) {
        swal.fire("Congratulations!", "Your order has been successfully added.", "success");
        callback(data);
    }, function (errs) {
        swal.fire(errs.responseText, "Please try again with different dates or select a different apartment.", "error");
    });
    // to prevent refreshing the page evrey time 
    return false;
}

function UpdateUser(callback, User) {
    ajaxCall("PUT", `${api}/WebUsers/Put`, JSON.stringify(User), function (data) {
        swal.fire("Update Sucsessfully!", "", "success");
        console.log(data)
        callback(data);
    }, errorRG);
    // to prevent refreshing the page evrey time 
    return false;
}
function UpdateOrder(callback, UserId, FlatId, StartDate, EndDate, PricePerNight, OrderId) {
    StartDate = new Date(StartDate)
    EndDate = new Date(EndDate)
    StartDate.setDate(StartDate.getDate() + 1);
    EndDate.setDate(EndDate.getDate() + 1);
    UpdatedOrder = {
        id: OrderId,
        userId: parseInt(UserId),
        flatId: parseInt(FlatId),
        startDate: StartDate,
        endDate: EndDate,
        pricePerNight: parseInt(PricePerNight)
    }
    ajaxCall("PUT", `${api}/Orders/PUT`, JSON.stringify(UpdatedOrder), function (data) {
        swal.fire("Changed!", "Your order has been successfully changed.", "success");
        callback(data);
        setTimeout(function () {
            window.location.reload();
        }, 1000); // 1 seconds delay
    }, function (errs) {
        swal.fire(errs.responseText, "Please try again with different dates or select a different apartment.", "error");
    });
    // to prevent refreshing the page evrey time 
    return false;
}
function DeleteOrderById(callback, OrderId) {
    ajaxCall("Delete", `${api}/Orders/${OrderId}`, "", function (data) {
        swal.fire("Deleted Sucsessfully!", "", "success");
        //console.log(data)
        //callback(data);
        setTimeout(function () {
            window.location.reload();
        }, 1000); // 1 seconds delay
    }, errorRG);
    return false;
}
function successClinetCB(data) {
    swal.fire(data ? "Added Succesfuly" : "Request denide", data ? "" : "The appartemnt is already in the system add another appartment", data ? "success" : "error");
    //popMessage(data ? "Added Succesfuly" : "Request denide", data ? "" : "The appartemnt is already in the system add another appartment");
    return false;
}

function successMannagerCB(data) {
    swal.fire((data[1].length ?? 1) > 0 ? `${data[0]} succses` : "Error", data[1].length > 0 || data[1] == true ? "" : "There are no Data to Show", (data[1].length ?? 1) > 0 ? "success" : "error");
    //popMessage((data[1].length ?? 1) > 0 ? `${data[0]} succses` : "Error", data[1].length > 0 || data[1] == true ? "" : "There are no Data to Show");
    return false;
}
function errorLG(errs) {
    // swal.fire("error : " + errs.status, errs.responseJSON.error + "<br/>Please check your email and password and try again.", "error");
    swal.fire("error : " + errs.status, errs.responseText + "<br/>Please check your email and password and try again.", "error");
    return false;
}
function errorRG(errs) {
    swal.fire("error : " + errs.status, errs.responseText + "!!" + "<br/>Please try logging in instead.", "error");
    return false;
}

function errorCB(errs) {
    // show error massage that came as a html elemnts
    swal.fire(errs.status, errs.responseText, "error");
    return false;
    //popMessage(errs.status, errs.responseText);
}
function errorNotEmailFound() {
    swal.fire("Oops ", "<br/>There is no email registered.", "error");
    return false;
}




