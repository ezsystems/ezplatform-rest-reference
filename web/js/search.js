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
    builder.field('name');
    builder.field('body');
    builder.field('root');
    builder.field('url');

    builder.pipeline.add(
        lunr.stopWordFilter
    );
}

function addIndexes() {
    searchSections.forEach(searchSection => {
        const name = getEndpointName(searchSection);
        const body = getEndpointBody(searchSection);
        const url = getEndpointUrl(searchSection);
        const urlParts = url.textContent.split('/').slice(1);
        let urlString = '';

        urlParts.forEach(urlPart => {
            urlString += `/${urlPart}`;

            addIndex(
                name.id,
                name.textContent.trim(),
                body ? body.textContent : '',
                searchSection.dataset.parent,
                `/${urlPart}`
            );
        });
    });
}

function addIndex(id, name, body, root, url) {
    builder.add({
        id: id,
        name: name,
        body: body,
        root: root,
        url: url
    });
}

function search(event) {
    if (event.keyCode === 27) {
        hideResultsBlock();
        this.value = '';
    }

    if (this.value.length > 0 && this.value.trim()) {
        showResultsBlock();
        showResults(
            getResults(this.value)
        );
    } else {
        hideResultsBlock();
    }
}

function getResults(searchValue, limit = 100) {
    const results = executeQuery(searchValue, buildQuery(searchValue));

    if (results.length === 0 && isLogicalAnd(searchValue)) {
        return executeQuery(searchValue, getLogicalAndQueryWithLeadingAndTrailingWildcards()).slice(0,limit);
    }

    if (results.length === 0 && !isLogicalAnd(searchValue)) {
        return executeQuery(searchValue, getQueryWithLeadingAndTrailingWildcards()).slice(0,limit);
    }

    return results.slice(0,limit);
}

function executeQuery(searchValue, options) {
    return index.query(query => {
        query.term(lunr.tokenizer(parseSearchValue(searchValue)), options);
    });
}

function buildQuery(searchValue) {
    if (isLogicalAnd(searchValue)) {
        return buildLogicalAndQuery();
    }

    return {
        wildcard: lunr.Query.wildcard.LEADING
    }
}

function getQueryWithLeadingAndTrailingWildcards() {
    return {
        wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
    }
}

function getLogicalAndQueryWithLeadingAndTrailingWildcards() {
    return {
        presence: lunr.Query.presence.REQUIRED,
        wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
    }
}

function parseSearchValue(searchValue) {
    if (!isLogicalAnd(searchValue)) {
        return searchValue;
    }

    return searchValue.slice(1,-1);
}

function isLogicalAnd(searchValue) {
    return searchValue.charAt(0) === '"'
        && searchValue.charAt(searchValue.length-1) === '"';
}

function buildLogicalAndQuery() {
    return {
        presence: lunr.Query.presence.REQUIRED
    };
}

function showResults(results) {
    searchResults.innerHTML = '<span class="search-result__close text-gray"><i class="material-icons">close</i></span>';

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
        searchResults.innerHTML += '<p class="text-gray">No results</p>';
    }
}

function highlight() {
    let words = searchInput.value.split(' ');

    words.forEach(word => {
        word = word.replace(/[.*"]/g, '');
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
