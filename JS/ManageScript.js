function Get(elem) {
    document.querySelector(".appartmentSlider").innerHTML = ""
    if (elem == "all") {
        getFromServer(function (data) {
            data.forEach(element => {
                createCard(element);
            });
            addDeleteButton();
            addBookButton();
        });
    }
    if (elem == "price") {
        const searchParamaters = document.getElementById('search-price').value
        getFromServerByPrice(function (data) {
            data.forEach(element => {
                createCard(element);
            });
            addDeleteButton();
            addBookButton();
        }, parseFloat(searchParamaters))
    }
    if (elem == "rating") {
        const searchParamaters = document.getElementById('search-rating').value
        getFromServerByRating(function (data) {
            data.forEach(element => {
                createCard(element);
            });
            addDeleteButton();
            addBookButton();
        }, parseFloat(searchParamaters));
    }
}

const pickerOptions = {
    startDate: new Date(),
    endDate: new Date(),
    locale: 'en',
    dateFormat: 'YYYY-MM-DD',
    maxDate: new Date()
};
function ShowPickRangeOfDates(btn, price = "", func, orderId = "") {
    if (price == "") {
        var price = Number(btn.parentNode.getElementsByTagName("span")[1].textContent.slice(1))
    }

    Swal.fire({
        title: 'Select Date Range',
        html:
            `<div>
            <label for="start-date">Start Date:</label>
            <input type="text" id="start-date" name="start-date" required>
          </div>
          <div>
            <label for="end-date">End Date:</label>
            <input type="text" id="end-date" name="end-date" required>
          </div>`,
        focusConfirm: false,
        didOpen: () => {
            startDatePicker = new Pikaday({ field: document.getElementById('start-date'), format: 'YYYY-MM-DD' });
            endDatePicker = new Pikaday({ field: document.getElementById('end-date'), format: 'YYYY-MM-DD' });
        },
        preConfirm: () => {
            const startDate = new Date(document.getElementById('start-date').value);
            const endDate = new Date(document.getElementById('end-date').value);
            // const startDate = new Date(`${document.getElementById('start-date').value}T00:00:00Z`);
            // const endDate = new Date(`${document.getElementById('end-date').value}T00:00:00Z`);

            const maxNights = 10;
            const nights = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
            console.log(new Date())
            if (startDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
                Swal.showValidationMessage(`Please enter a valid start date and end date`);
            } else
                if (startDate > endDate) {
                    Swal.showValidationMessage(`The start date can't be after the end date`);
                } else if (nights > maxNights) {
                    Swal.showValidationMessage(`The date range can't be longer than ${maxNights} nights`);
                } else if(new Date() > startDate){
                    Swal.showValidationMessage(`The start date can't be in the past`);
                } else {
                    return { startDate: startDate.toLocaleDateString('zh-Hans-CN'), endDate: endDate.toLocaleDateString('zh-Hans-CN') };
                }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const startDate = result.value.startDate;
            const endDate = result.value.endDate;
            if (orderId != "") {
                func((data) => {
                    console.log(data)
                }, JSON.parse(localStorage.getItem("userName")).id, btn.id.substring(4), startDate, endDate, Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * price, orderId)
            }
            else {
                func((data) => {
                    console.log(data)
                }, JSON.parse(localStorage.getItem("userName")).id, btn.id.substring(4), startDate, endDate, Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * price)
            }
        }
    });
}
// Swal.fire({
//     title: "Select a date range",
//     html:
//         '<div class="swal-dates">' +
//         '<label for="start-date">Start Date: </label>' +
//         '<input type="date" id="start-date" name="start-date">' +
//         '<label for="end-date"><br>End Date: </label>' +
//         '<input type="date" id="end-date" name="end-date">' +
//         "</div>",
//     showCancelButton: true,
//     confirmButtonText: "Submit",
//     preConfirm: () => {
//         // When the user clicks the "Submit" button, update the date selections object
//         dateSelections.startDate = document.getElementById("start-date").value;
//         dateSelections.endDate = document.getElementById("end-date").value;
//     },
// }).then((result) => {
//     // When the Swal popup is closed, display the selected start and end dates
//     if (result.isConfirmed) {
//         const sdate = new Date(dateSelections.startDate);
//         const edate = new Date(dateSelections.endDate);

//         order = {
//             userId: String(JSON.parse(localStorage.getItem("user_id"))),
//             flatId: 15, //parseInt(flat.className), NEED TO FIX ORDER INSERT PROCEDURE!
//             startDate: sdate.toISOString().slice(0, 10),
//             endDate: edate.toISOString().slice(0, 10),
//         };

//         console.log(order);
//         ajaxCall(
//             "POST",
//             orderApi,
//             JSON.stringify(order),
//             successOrder,
//             errorOrder
//         );
//     }
// });
// function PostOrderDetails(func){
//     func((data) => {
//         // console.log(Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * price )
//     }, JSON.parse(localStorage.getItem("userName")).id, btn.id.substring(4), startDate, endDate, Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * price)
//     // console.log(`Start Date: ${startDate}, End Date: ${endDate}`);

// }