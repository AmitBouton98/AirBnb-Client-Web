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
                // need to change the price per night in button update. devide it between the number of nights
                `<img id="Flat${element.flatId}" onclick="ShowPickRangeOfDates(this , ${element.pricePerNight / ((new Date(element.endDate) - new Date(element.startDate)) / oneDayMs)}, UpdateOrder,${element.id})" src="../Data/image/5278658-removebg-preview.png"/>`,
                //`<button onclick="DeleteOrder(${element.id})" >delete</button>`
                // `<img id="Flat${element.flatId}" onclick="ShowPickRangeOfDates(this , ${element.pricePerNight / ((new Date(element.endDate) - new Date(element.startDate)) / oneDayMs)}, UpdateOrder,${element.id})" src="../Data/image/66-664202_update-button-clip-art-png-update-button-removebg-preview.png"/>`
                `<img onclick="DeleteOrder(${element.id})" src="../Data/image/delete-icon-png-16x16-22.jpg" />`
            ]);
        }
        const dataTable = $("#table_id").DataTable({
            "pageLength": 5,
            "lengthMenu": [5,10,100],
            "lengthChange": true,
            "responsive": true,
            "columnDefs": [
                        { responsivePriority: 1, targets: 0 },
                        { responsivePriority: 2, targets: 4 }
                    ],
                'data': res
        });
    })
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