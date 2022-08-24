let favorites = JSON.parse(localStorage.getItem('favorites')) || []

// variaveis
const $ = document.querySelector.bind(document)
const imageContainer = $('.image')

// eventos
$('.random').onclick = () => updateImage()
$(".fav-images").onclick = () => modalImages()
imageContainer.onclick = () => updateAll()


// métodos
function getState() {
    const imageSource = $('.image img').src
    const parent = $(".modal-parent")
    const X = $(".X")
    const main = $("main")
    const modalContainer = $('.modal')
    const remove = $('#remove')

    const index = favorites.indexOf(imageSource)
    const existsInLocalStorage = index != -1

    return { imageSource, parent, X, main, index, existsInLocalStorage, modalContainer, remove }
}

function updateAll() {
    updateFavorites()
    updateClasses()
}

function updateFavorites() {
    const { existsInLocalStorage, index, imageSource } = getState()

    existsInLocalStorage
        ? favorites.splice(index, 1)
        : favorites.push(imageSource)

    localStorage.setItem('favorites', JSON.stringify(favorites))
}

function updateClasses() {
    const { existsInLocalStorage } = getState()

    imageContainer.classList.add('fav')

    if (existsInLocalStorage) {
        imageContainer.classList.remove('fav')
    }
}

function modalImages() {
    const { parent, X, main, modalContainer, remove, index } = getState()

    getModalStyles("block", "blur(10px)")

    X.addEventListener("click", () => {
        getModalStyles("none", "blur(0px)")
        reload()
    })

    parent.addEventListener("click", (e) => {
        if (e.target.className == "modal-parent") {
            getModalStyles("none", "blur(0px)")
            reload()
        }
    })

    showImagesInModal()

    function getModalStyles(display, filter) {
        parent.style.display = display
        main.style.filter = filter
    }

    function showImagesInModal() {
        favorites.forEach(img => {
            const images = document.createElement("img")
            const imagesContainer = modalContainer.appendChild(images)
            imagesContainer.src = img
        })

    }
    remove.onclick = removeAllModalImages
    function removeAllModalImages() {
        localStorage.removeItem('favorites')
        alert('Imagens removidas com sucesso')
        reload()

    }
}
function reload() {
    document.location.reload(true)
}

async function updateImage() {
    await getExternalImage()
    updateClasses()
}

async function getExternalImage() {
    const response = await fetch('https://source.unsplash.com/random')

    imageContainer
        .innerHTML = `<img src="${response.url}" >`
}

getExternalImage()