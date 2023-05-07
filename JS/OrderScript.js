$(document).ready(function () {
    formatData()
    document.querySelector("#userName").innerText = JSON.parse(localStorage.getItem("userName")).first + " " + JSON.parse(localStorage.getItem("userName")).last
    document.querySelector(".userImage img").setAttribute("src",JSON.parse(localStorage.getItem("userName")).profile_img)
    // update details
    $('#UpdateDetailsButton').click(function () {
        UpdateDetails();
    });
    // logging out
    $('#logoutButton').click(function () {
        localStorage.clear();
        // select all elements with the value "Back" and hide them
        window.location.href = `../pages/index.html`
    });
    if (localStorage.getItem('userName') == undefined) {
        window.location.href = `../pages/index.html`
        return;
    }
    
});

function formatData() {
    getOrdersById(JSON.parse(localStorage.getItem("userName")).id, async (data) => {
        const oneDayMs = 24 * 60 * 60 * 1000; // number of milliseconds in a day
        let res = [];
        for (const element of data) {
            const flat = await getFlatById(element.flatId);
            res.push([
                element.id,
                element.flatId,
                `<img  class="float-img" src="${flat.picture_url}" alt="" onclick="popImage(this)">`,
                element.startDate.slice(0, 10),
                element.endDate.slice(0, 10),
                element.pricePerNight,
                // need to change the price per night in button update. devide it between the number of night
                `<i id="Flat${element.flatId}" onclick="ShowPickRangeOfDates(this , ${element.pricePerNight / ((new Date(element.endDate) - new Date(element.startDate)) / oneDayMs)}, UpdateOrder,${element.id})" class="fa-solid fa-pen-to-square"></i>`,
                // `<img id="Flat${element.flatId}" onclick="ShowPickRangeOfDates(this , ${element.pricePerNight / ((new Date(element.endDate) - new Date(element.startDate)) / oneDayMs)}, UpdateOrder,${element.id})" src="../Data/image/5278658-removebg-preview.png"/>`,
                //`<button onclick="DeleteOrder(${element.id})" >delete</button>`
                // `<img id="Flat${element.flatId}" onclick="ShowPickRangeOfDates(this , ${element.pricePerNight / ((new Date(element.endDate) - new Date(element.startDate)) / oneDayMs)}, UpdateOrder,${element.id})" src="../Data/image/66-664202_update-button-clip-art-png-update-button-removebg-preview.png"/>`
                `<i onclick="DeleteOrder(${element.id})" class="fa-solid fa-trash"></i>`,
                // `<img onclick="DeleteOrder(${element.id})" src="../Data/image/delete-icon-png-16x16-22.jpg" />`,
                `<i onclick="ShowOrderDetailes('${element.id}','${element.flatId}','${element.startDate.slice(0, 10)}','${element.endDate.slice(0, 10)}','${element.pricePerNight}','${flat.picture_url}')" class="fa-sharp fa-solid fa-eye"></i>`
            ]);
        }
        const table = $("#table_id").DataTable({
            "pageLength": 5,
            "lengthMenu": [5,10,100],
            "lengthChange": true,
            "responsive": true,
            "columns": [
                { class: "responsive1" },
                { class: "responsive2" },
                { class: "responsive3" },
                { class: "responsive4" },
                { class: "responsive5" },
                { class: "responsive6" },
                { class: "responsive7" },
                { class: "responsive8" },
                { class: "responsive9" }
            ],
            'data': res
        });
        
        $("#table_id").ready(()=>{
            const loader = document.querySelector(".loader")
            loader.classList.add("loader-hidden")
            loader.addEventListener("transitioned",()=>{
                document.body.removeChild("loader");
            })
        })
    })
}
function ShowOrderDetailes(orderId,flatId,startDate,endDate,price,flatImageUrl) {
    document.querySelector("#imageCell img").setAttribute("src",flatImageUrl)
    document.querySelector("#OrderIdCell").innerText =  orderId
    document.querySelector("#FlatIdCell").innerText =  flatId
    document.querySelector("#startDateCell").innerText =  startDate
    document.querySelector("#endDateCell").innerText =  endDate
    document.querySelector("#priceCell").innerText =  price
    if($('#OrderInfoPart').is(':visible')) {
        closeOrderInfo();
    }
    else {
        $('#OrderInfoPart').show()
    }
}
function closeOrderInfo() {
     $('#OrderInfoPart').hide()
}

function popImage(elem) {
    if (elem.classList.contains("popImage")) {
        elem.classList.remove("popImage")
    }
    else {
        elem.classList.add("popImage")
    }
}
function DeleteOrder(OrderId){
    DeleteOrderById((data)=>{
        console.log(data)
    },OrderId)
}