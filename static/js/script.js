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

function loadLatestURLs() {
    fetch('/latest_urls')
        .then(response => response.json())
        .then(data => {
            const latestUrlsContainer = document.getElementById('latest-urls');
            const latestUrlsList = document.createElement('ul');
            
            data.urls.slice(0, 5).forEach(urlData => {
                const urlItem = document.createElement('li');
                
                // Crea un contenedor para el favicon y el enlace
                const linkContainer = document.createElement('div');
                linkContainer.classList.add('link-container');
                
                // Carga el favicon
                loadFavicon(urlData.full_url, linkContainer);

                // Crea un enlace (<a>) con la URL completa
                const urlLink = document.createElement('a');
                urlLink.href = urlData.full_url; // Enlace real al que lleva el enlace
                urlLink.textContent = window.location.origin + '/' + urlData.short_url; // Muestra el dominio completo en pantalla
                urlLink.target = "_blank";
                linkContainer.appendChild(urlLink);
                
                urlItem.appendChild(linkContainer);
                latestUrlsList.appendChild(urlItem);
            });
            
            latestUrlsContainer.innerHTML = '';
            latestUrlsContainer.appendChild(latestUrlsList);
        });
}



function loadFavicon(url, container) {
    // Carga el favicon de la URL
    // Puedes utilizar una API de extracción de favicons o una biblioteca para esta tarea
    // Añade el favicon como una imagen al contenedor
    const faviconImg = document.createElement('img');
    faviconImg.src = `https://www.google.com/s2/favicons?sz=32&domain=${url}`;
    container.appendChild(faviconImg);
}

loadLatestURLs()

// Realiza una nueva carga de URLs cada 10 segundos
setInterval(loadLatestURLs, 80000);