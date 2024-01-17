function validateForm() {
    var url = document.forms["urlForm"]["url"].value;
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                             '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                             '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                             '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                             '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                             '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    var mensajeElement = document.getElementById("mensaje");

    if (!url || !pattern.test(url)) {
        mensajeElement.innerHTML = "Por favor, introduzca una URL válida.";
        mensajeElement.style.color = '#eae133';
        return false;
    }
    mensajeElement.style.color = 'initial';
    return true;
}