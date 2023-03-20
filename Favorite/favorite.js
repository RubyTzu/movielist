//variable
const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
let SearchMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const styleBar = document.querySelector('#style-bar')
const cardStyle = document.querySelector('#card-style')
const lineStyle = document.querySelector('#line-style')
let currentPage = 1;




//function
function switchToCardListPage() {
    cardStyle.classList.add('switch-style-btn-click')
    lineStyle.classList.remove('switch-style-btn-click')
}

function switchToLineListPage() {
    lineStyle.classList.add('switch-style-btn-click')
    cardStyle.classList.remove('switch-style-btn-click')
}

function renderMovieCardList(data) {

    rawHTML = ''
    data.forEach(item => {

        rawHTML += `
                <div class="col-auto col-xl-3">
                    <div class="card d-flex flex-column align-items-center mb-3 rounded-5 border border-0 single-card-group">
                        <img src="${POSTER_URL + item.image}"
                            class="movie-image card-img-top w-75 mt-5 mb-3 border border-warning rounded-2" alt="Movie Poster" data-bs-toggle="modal"
                                data-bs-target="#movie-Modal" data-id="${item.id}">

                            <div class="card-body w-100 d-flex justify-content-between">
                                <p class="card-text mt-1 mb-3 ps-4">${item.title}</p>
                                <a href="#" class="card-link text-decoration-none fs-3 pe-4 mb-4 mt-0"><i id="favorite-btn"
                                    class="fa-solid fa-heart pe-0 favorite-btn" data-id="${item.id}"></i></a>
                            </div>
                    </div>
                </div>  
    `
    })

    dataPanel.innerHTML = rawHTML
}


function renderMovieLineList(data) {

    let rawHTML = ''

    rawHTML += '<ul class="list-group list-group-flush w-75 mb-3">'

    data.forEach(item => {

        rawHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent py-3">
                <div class="ms-2 me-auto">
                    ${item.title}
                </div>
                <ul class="d-flex fs-3">
                    <li>
                        <a class="text-decoration-none m-2" href="#"><i class="info-btn fa-solid fa-circle-info  movie-list-btn" data-bs-toggle="modal" data-bs-target="#movie-Modal" data-id="${item.id}"></i></a>
                    </li>
                    <li>
                        <a class="text-decoration-none m-2" href="#"><i class="fa-solid fa-heart favorite-btn" data-id="${item.id}"></i></a>
                    </li>
                </ul>
            </li>
        `
    })

    rawHTML += '</ul >'

    dataPanel.innerHTML = rawHTML

}


function renderPaginator(amount) {

    let numberOfPages = Math.ceil(amount / 12)
    let rawHTML = ''

    for (let page = 1; page <= numberOfPages; page++) {
        rawHTML += `
    <li class="page-item"><a class="page-link pagination-style rounded-0" href="#" data-page="${page}">${page}</a></li>
    `
    }

    paginator.innerHTML = rawHTML
}


function getMoviesByPage(page) {

    let pageContent = SearchMovies.length ? SearchMovies : movies
    let StartMovie = (page - 1) * 12
    return pageContent.slice(StartMovie, StartMovie + 12)

}

function MovieIDtoPage(id) {
    let pageContent = SearchMovies.length ? SearchMovies : movies
    let movieIndex = pageContent.findIndex(element => element.id === id)
    let currentPage = Math.ceil((movieIndex + 1) / 12)

    return currentPage

}



function showMovieModal(id) {
    const modalTitle = document.querySelector('#movie-modal-name')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')





    axios
        .get(INDEX_URL + '/' + id)
        .then(response => {
            let data = response.data.results
            modalTitle.innerText = data.title
            modalDate.innerText = 'Release date: ' + data.release_date
            modalDescription.innerText = data.description
            modalImage.setAttribute("src", `${POSTER_URL + data.image}`)
        })

}


function hadFavorite() {
    //Card style list
    if (cardStyle.matches('.switch-style-btn-click')) {


        let CurrentPageMoviesNum = dataPanel.childElementCount

        for (let i = 0; i < CurrentPageMoviesNum; i++) {

            let chooseBtn = dataPanel.children[i].children[0].children[1].children[1].children[0]

            chooseBtn.classList.add('favorite-btn-click')

        }

    }

    //line style list
    else if (lineStyle.matches('.switch-style-btn-click')) {

        let CurrentPageMoviesNum = dataPanel.children[0].childElementCount

        for (let i = 0; i < CurrentPageMoviesNum; i++) {

            let chooseBtn = dataPanel.children[0].children[i].children[1].children[1].children[0].children[0]

            chooseBtn.classList.add('favorite-btn-click')

        }

    }



}


function removeFromFavorite(id) {

    let pageContent = SearchMovies.length ? SearchMovies : movies
    let removeIndex = pageContent.findIndex(element => element.id === id)

    pageContent.splice(removeIndex, 1)

    localStorage.setItem('favoriteMovies', JSON.stringify(pageContent))
}





//event Listener
dataPanel.addEventListener('click', function onClickedPanel(e) {
    if (e.target.matches('.movie-image') || e.target.matches('.info-btn')) {
        showMovieModal(Number(e.target.dataset.id))
    }

    if (e.target.matches('.favorite-btn') && (e.target.classList.contains('favorite-btn-click'))) {

        e.target.classList.toggle('favorite-btn-click')
        removeFromFavorite(Number(e.target.dataset.id))

        let pageContent = SearchMovies.length ? SearchMovies : movies


        renderPaginator(pageContent.length)

        if (cardStyle.matches('.switch-style-btn-click')) {
            renderMovieCardList(getMoviesByPage(currentPage))
        } else if (lineStyle.matches('.switch-style-btn-click')) {
            renderMovieLineList(getMoviesByPage(currentPage))
        }


        hadFavorite()

    }
})


paginator.addEventListener('click', function onClickedPaginator(e) {
    const page = Number(e.target.dataset.page);
    currentPage = page

    if (e.target.matches('.page-link') && cardStyle.matches('.switch-style-btn-click')) {
        renderMovieCardList(getMoviesByPage(page))
    } else if (e.target.matches('.page-link') && lineStyle.matches('.switch-style-btn-click')) {
        renderMovieLineList(getMoviesByPage(page))
    }
    hadFavorite()
})


searchForm.addEventListener('submit', function onSearchForm(e) {

    e.preventDefault()
    const searchValue = searchInput.value.trim().toLowerCase()

    if (!searchValue.length) {
        alert('Please enter valid string!')
    }


    SearchMovies = movies.filter(serMovie => {
        let serMovieName = serMovie.title.toLowerCase()

        if (serMovieName.includes(searchValue)) {
            return serMovie
        }
    })



    renderPaginator(SearchMovies.length)
    currentPage = 1

    if (cardStyle.matches('.switch-style-btn-click')) {
        renderMovieCardList(getMoviesByPage(currentPage))
    } else if (lineStyle.matches('.switch-style-btn-click')) {
        renderMovieLineList(getMoviesByPage(currentPage))
    }

    hadFavorite()



})

styleBar.addEventListener('click', function onClickedStyleBar(e) {

    if (e.target.matches('#card-style')) {
        switchToCardListPage()
        renderMovieCardList(getMoviesByPage(currentPage))

    } else if (e.target.matches('#line-style')) {
        switchToLineListPage()
        renderMovieLineList(getMoviesByPage(currentPage))
    }

    hadFavorite()

})

//first Render
renderPaginator(movies.length)
switchToCardListPage()
renderMovieCardList(getMoviesByPage(currentPage))
hadFavorite()
