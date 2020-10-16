const API_KEY = "2aa29ade710943a6bcef43ddcf4fea34";
const HEADLINES_API_URL = `http://newsapi.org/v2/top-headlines?country=br&apiKey=${API_KEY}`;
const storage = localStorage;
let storageNewsData = [];

const buildArticleContent = obj => {
    const objData = new Date(obj.publishedAt);
    const article = `
                <article>
                    <div class="img-container">
                        <img src="${obj.urlToImage}" alt="image from api" class="img-thumbnail"/>
                    </div>
                    <div class="content">
                        <a class="content__title" href="${obj.url}">${obj.title}</a>
                        <br/>
                        <span class="content__info">${objData.toLocaleString()} - ${obj.source.name} - ${obj.author} </span>
                        <p class="content__tect">${obj.content}</p>
                    </div>
                </article>
            `;
    return article
}

const buildHeadlinesContainer = res => {
    const data = JSON.parse(res.target.responseText);

    const headlinesDiv = document.getElementById("headlines");
    let sections = "";
    if(data) for(i=0; i < 4; i++) sections += buildArticleContent(data.articles[i]);
    else sections = "<p>No data</p>";

    headlinesDiv.insertAdjacentHTML('afterbegin', sections);
}

const buildSearchContainer = res => {
    const insertContainerOnScreen = () => {
        const container =` 
            <div class="search-title">
                <h3 id="news-search-title"></h3>
                <button id="save-btn" data-toggle="modal" onClick="openModal()" data-target="#modalExemplo">Save search</button>
            </div>
            <section id="news-search"></section>`;
        const newsDiv = document.getElementById("news");
        newsDiv.insertAdjacentHTML('beforeend', container);
    }

    const verify = document.getElementById("news-search");
    if(!verify) insertContainerOnScreen();

    const data = JSON.parse(res.target.responseText);

    const searchTitle = document.getElementById("news-search-title");
    searchTitle.innerHTML = "";
    searchTitle.insertAdjacentHTML('afterbegin', `Pesquisa: ${getSearchInputValue()}`);

    let sections = "";
    if(data) for(let i=0; i < 4; i++) sections += buildArticleContent(data.articles[i]);
    else sections = "<p>No data</p>";

    const searchDiv = document.getElementById("news-search");
    searchDiv.insertAdjacentHTML('afterbegin', sections);
}

const getSearchInputValue = () => {
    return document.getElementById("pesquisa").value;
}

const onSearchClick = () => {
    const inputVal = getSearchInputValue();
    requestDataOnSearch(inputVal);
}

const requestDataOnSearch = (searchVal) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = buildSearchContainer;
    const SEARCH_API_URL = `http://newsapi.org/v2/everything?q=${searchVal}&apiKey=${API_KEY}`;
    xhr.open("GET", SEARCH_API_URL, true);
    xhr.send();
}

const buildStorageContainer = res => storageNewsData.push(JSON.parse(res.target.responseText));

const requestDataOnStorage = (value) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = buildStorageContainer;
    const SEARCH_API_URL = `http://newsapi.org/v2/everything?q=${value}&apiKey=${API_KEY}`;
    xhr.open("GET", SEARCH_API_URL, true);
    xhr.send();
}

const setValueOnStorage = () => {
    const searchTitle = document.getElementById("search__title").value;
    storage.setItem(searchTitle, getSearchInputValue());
}

const openModal = () => {
    const searchInput = document.getElementById("search__value");
    searchInput.value = getSearchInputValue();
}

const buildNav = () => {
    const storageItens = Object.entries(localStorage);
    const navDiv = document.getElementById("storage-nav");
    let text = "";
    storageItens.forEach(item => text += `<a href="#storage-search-${item[1]}">${item[0]}</a>`)
    navDiv.insertAdjacentHTML('beforeend', text);
}

const buildSavedSearchedOnScreen = () => {
    const storageItens = Object.entries(localStorage);
    let cont = 0;
    storageItens.forEach(item => {
        const container =` 
            <div class="search-title">
                <h3 id="news-search-title-${item[1]}">${item[0]}</h3> 
            
     </div>
        <section id="storage-search-${item[1]}"></section>`;
        const newsDiv = document.getElementById("news");
        newsDiv.insertAdjacentHTML('beforeend', container);
        const data = storageNewsData[cont];

        let sections = "";
        if(data) for(i=0; i < 4; i++) sections += buildArticleContent(data.articles[i]);
        else sections = "<p>No data</p>";

        const secDiv = document.getElementById(`storage-search-${item[1]}`);
        secDiv.insertAdjacentHTML('beforeend', sections);
    });
    buildNav();
}

const requestSavedSearchesData = () => {
    const storageItens = Object.entries(localStorage);
    storageItens.forEach(item => requestDataOnStorage(item[1]));
}

$(document).ready( function () {
    const xhr = new XMLHttpRequest();
    xhr.onload = buildHeadlinesContainer;
    xhr.open("GET", HEADLINES_API_URL, true);
    xhr.send();

    requestSavedSearchesData();

    setTimeout(() => buildSavedSearchedOnScreen(), 1000)

});
