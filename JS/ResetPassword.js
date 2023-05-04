$(document).ready(function () {
    const resetFormEl = $("#reserPasswordEmail")
    const userIdEl = document.querySelector("#IdReset")
    const userKeyEl = document.querySelector("#uniqueKey")
    const userNewPasswordEl = document.querySelector("#resetpasswordOne")
    const userEmailEl = document.querySelector("#userEmailWelcome")

    const url = new URL(window.location.href);
    userEmailEl.innerHTML = url.searchParams.get('userEmail')
    if (url.searchParams.get('userEmail') == undefined) {
        window.location.href = `../pages/index.html`
    }

    resetFormEl.submit(function () {
        PostResetPassword(userKeyEl.value, userNewPasswordEl.value, userIdEl.value)
        return false;
    })
}
)
