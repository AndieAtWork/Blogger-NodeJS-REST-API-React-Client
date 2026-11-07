export function handleAlert(title, content, alertType, cancelText, confirmText, callback) {
        
    var msgIcon = "";
    var confirmButtonColor = "";
    if (alertType == 0){
        msgIcon = "success";
        confirmButtonColor = '#80e573';
    }else if (alertType == 1){
        msgIcon = "info";
        confirmButtonColor = '#24cdf7';
    }else if (alertType == 2){
        msgIcon = "error";
        confirmButtonColor = '#ff4848';
    }

    window.Swal.fire({
        title: title,
        text: content,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: confirmButtonColor,
        cancelButtonColor: '#5e6163',
        icon: msgIcon
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}

export function forbiddenAlert(){
    window.Swal.fire({
        title: "403 Forbidden Error",
        text: "",
        showCancelButton: false,
        confirmButtonText: "Ok",
        confirmButtonColor: '#ff4848',
        icon: "error"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/blog";
        }
    });
}

export function notFoundAlert(){
    window.Swal.fire({
        title: "404 Not Found",
        text: "",
        showCancelButton: false,
        confirmButtonText: "Ok",
        confirmButtonColor: '#ff4848',
        icon: "error"
    })
}

export function serverErrorAlert(){
    window.Swal.fire({
        title: "500 Server Error",
        text: "",
        showCancelButton: false,
        confirmButtonText: "Ok",
        confirmButtonColor: '#ff4848',
        icon: "error"
    })
}

export function badRequestAlert(text=''){
    window.Swal.fire({
        title: "400 Bad Request Error",
        text: text,
        showCancelButton: false,
        confirmButtonText: "Ok",
        confirmButtonColor: '#ff4848',
        icon: "error"
    })
}

export function unauthorizedAlert(){
    window.Swal.fire({
        title: "401 Unauthorized Error",
        text: "",
        showCancelButton: false,
        confirmButtonText: "Ok",
        confirmButtonColor: '#ff4848',
        icon: "error"
    })
}

export function sessionExpiredAlert(){
    window.Swal.fire({
        title: "401 Unauthorized Error",
        text: "Your session has expired",
        showCancelButton: false,
        confirmButtonText: "Ok",
        confirmButtonColor: '#ff4848',
        icon: "error"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/";
        }
    });
}