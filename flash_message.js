import Swal from 'sweetalert2'
let timerInterval
function flash_message(type, title, html = false, button = false, toast = true, timer = 2000) {
    Swal.fire({
        icon: type,
        title: title,
        html: html,
        timer: timer,
        timerProgressBar: true,
        toast: toast,
        showConfirmButton: button,

        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            //console.log('I was closed by the timer')
        }
    })
}
export default flash_message;