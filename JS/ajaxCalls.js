function ajaxCall(method, api, data, successCB, errorCB) {
    $.ajax({
        type: method, // Get/Post/Put/Delete/Patch
        url: api, // routing to the server
        data: data, // the data we pass in the body (if any…)
        cache: false, // allow caching
        contentType: "application/json", // the data format we expect back
        dataType: "json", // the data format that we send 
        success: successCB, // the success callback function
        error: errorCB // the error callback function
    });
    
}

// ajax upload
function ajaxUpload(api, data, showImages, error) {
$.ajax({
    url: api, // routing to the server
    type: "POST", // Get/Post/Put/Delete/Patch
    cache: false, // allow caching
    contentType: false, // the data format we expect back
    processData: false, // the data format that we send 
    data: data, // the data we pass in the body (if any…)
    success: showImages, // the success callback function
    error: error // the error callback function
});

}