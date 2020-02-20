'use strict';

let index = lunr.Index;
const builder = new lunr.Builder;
const searchSections = document.querySelectorAll('.page-section');
const searchResults = document.getElementById('search-results');
const searchInput = document.getElementById('search-input');
const dropdownMenu = document.getElementById('dropdownMenuLink');

configureIndexBuilder();
addIndexes();
index = builder.build();

searchInput.addEventListener('keyup', search);
document.addEventListener('click', event => {
    if (event.target !== searchResults) {
        hideResultsBlock();
    }

    if (event.target === searchInput && event.target.value.trim()) {
        showResultsBlock();
    }
});
dropdownMenu.addEventListener('click', event => {
    hideResultsBlock();
});

console.log(index);

function configureIndexBuilder() {
    builder.ref('id');
    builder.field('name', { boost: 10 });
    builder.field('body');
    builder.field('url');
    builder.field('root');

    builder.pipeline.add(
        lunr.stopWordFilter
    );
}

function addIndexes() {
    searchSections.forEach(searchSection => {
        let name = getEndpointName(searchSection);
        let body = getEndpointBody(searchSection);
        let url = getEndpointUrl(searchSection);

        builder.add({
            id: name.id,
            name: name.textContent.trim(),
            body: body ? body.textContent : '',
            url: url.textContent,
            root: searchSection.dataset.parent
        });
    });
}

function search(event) {
    if (event.keyCode === 27) {
        hideResultsBlock();
        this.value = '';
    }
    if (this.value.length > 0 && this.value.trim()) {
        searchResults.classList.remove('d-none');
        let results = index.search(`${validateSearchValue(this.value)}*`);
        showResults(results.slice(0,10));
    } else {
        hideResultsBlock();
    }
}

function validateSearchValue(value) {
    return isEndpointUrl(value) && value.charAt(0) !== '/' ? `/${value}` : value;
}

function isEndpointUrl(value) {
    return value.split('/').length > 1;
}

function showResults(results) {
    searchResults.innerHTML = '<span class="search-result__close"><i class="material-icons">close</i></span>';

    if (results.length > 0) {

        results.forEach(result => {
            const endpointSection = document.getElementById(`${result.ref}-section`);
            let resultRow = document.createElement('div');
            resultRow.classList.add('border-bottom');

            const name = getEndpointName(endpointSection);
            const body = getEndpointBody(endpointSection);

            resultRow.innerHTML = `<a href="#${result.ref }" class="search__link py-3 d-block">
                        <p class="font-weight-medium">
                            ${getEndpointMethod(endpointSection).outerHTML}
                            ${name.textContent} - <span class="text-orange">${endpointSection.dataset.parent}</span>
                        </p>
                        <p class="mb-0">${body.textContent.trim()}</p>
                    </a>`;

            searchResults.append(resultRow);
            highlight();
        });

        const searchLinks = document.querySelectorAll('.search__link');

        searchLinks.forEach(link => {
            link.addEventListener('click', event =>{
                hideResultsBlock();
            });
        });
    } else {
        searchResults.innerHTML += '<p>No results</p>';
    }
}

function highlight() {
    let words = searchInput.value.split(' ');

    words.forEach(word => {
        $(searchResults).highlight(word);
    });
}

function showResultsBlock() {
    searchResults.classList.remove('d-none');
}

function hideResultsBlock() {
    searchResults.classList.add('d-none');
}

function getEndpointName(section) {
    return section.querySelector('[data-field="name"]');
}

function getEndpointBody(section) {
    return section.querySelector('[data-field="body"]');
}

function getEndpointUrl(section) {
    return section.querySelector('[data-field="url"]');
}

function getEndpointMethod(section) {
    return section.querySelector('[data-field="method"]');
}
