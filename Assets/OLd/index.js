const APIURL = "https://api.github.com/users/";
const DeafultURL = "https://api.github.com/users/kkrypt0nn";
// const DeafultURL = "https://api.github.com/users/6Rahulr";
// 
const PagInationURL = "https://api.github.com/users/kkrypt0nn/repos?page=1&per_page=10";
// const PagInationURL = "https://api.github.com/users/6Rahulr/repos?page=1&per_page=10";




// 
const image1 = document.getElementById("image1");
const pName = document.getElementById("pName");
const githubLink = document.getElementById("GithubLink");
const pCity = document.getElementById("pCity");
const pBio = document.getElementById("pBio");
const pFollowers = document.getElementById("pFollowers");
const pFollowing = document.getElementById("pFollowing");
const pTotalPublicRepo = document.getElementById("pTotalPublicRepo");
const twitterLink = document.getElementById("twitterLink");

const container1 = document.getElementById("container1");
const searchButton = document.getElementById("Search");
const nameValue = document.getElementById("NameValue");
let totalPages = 1;
let currentPage = 1;
let defaultReposPerPage = 10;


const getDetails = async (url) => {
    try {
        showDetailsLoading();
        const response = await fetch(url);
        const data = await response.json();
        console.log(response);
        hideDetailsLoading();
        showDetails(data);
        nameValue.value=data.login;


        const totalRepos = data.public_repos;
        const reposPerPage = 10;

        totalPages = calculateTotalPages(totalRepos, reposPerPage);

        updatePagination(currentPage, data);
    } catch (error) {
        hideDetailsLoading();
        console.error("Error fetching user details:", error);
    }
};
function calculateTotalPages(totalItems, itemsPerPage) {
    return Math.ceil(totalItems / itemsPerPage);
}



const showDetails = (data) => {
    image1.src = data.avatar_url ? data.avatar_url : "Assets/github-mark.png";
    pName.innerHTML = data.login ? data.login : "No User Name";
    githubLink.href = data.html_url ? data.html_url : "https://github.com/";
    githubLink.textContent = "Visit GitHub Profile";
    pCity.innerHTML = data.location ? data.location : "No Location";
    pBio.innerHTML = data.bio ? data.bio : "No Bio found";
    twitterLink.href = data.twitter_username ? `https://twitter.com/${data.twitter_username}` : "No Twitter";
    twitterLink.textContent = data.twitter_username || "No Twitter";
    pFollowers.innerHTML = data.followers ? data.followers : 0;
    pFollowing.innerHTML = data.following ? data.following : 0;
    pTotalPublicRepo.innerHTML = data.public_repos ? data.public_repos : 0;


};

searchButton.addEventListener("click", function (event) {
    console.log("Clicked");
    event.preventDefault();
    const userName = nameValue.value.trim();
    console.log(userName);
    if (userName !== "") {
        getDetails(`${APIURL}${userName}`);




    }
});
const showDetailsLoading = () => {
    // You can replace this with an image or any other loading indicator
    pName.innerHTML = '<img src="Assets/github-mark.png" alt="GitHub Loading" style="width: 100px; height: 100px;">';
    image1.src = "Assets/github-mark.png";
};
const hideDetailsLoading = () => {
    pName.innerHTML = ""; // Clear the loading indicator
};


// 
const repoContainer = document.getElementById('repoContainer');





const showRepoDetails = async (url) => {
    repoContainer.innerHTML = '<img src="Assets/github-mark.png" alt="GitHub Loading" style="width: 100px; height: 100px;">';

    try {
        const response = await fetch(url);
        const repoData = await response.json();

        if (Array.isArray(repoData) && repoData.length > 0) {
            repoContainer.innerHTML = "";

            for (const repo of repoData) {
                const existingElement = document.getElementById(`repo-${repo.id}`);
                if (existingElement) {
                    continue;
                }

                const column = document.createElement('div');
                column.classList.add('column');

                const row = document.createElement('div');
                row.classList.add('row');

                const title = document.createElement('a');
                title.classList.add('title');
                title.href = repo.html_url;
                title.target = '_blank';
                title.textContent = repo.name;

                const description = document.createElement('div');
                description.classList.add('description');
                description.textContent = repo.description;

                const list = document.createElement('ul');
                list.classList.add('list');

                if ('topics' in repo && Array.isArray(repo.topics) && repo.topics.length > 0) {
                    const topicsToShow = window.innerWidth < 768 ? 5 : repo.topics.length;
                console.log(repo.topics.length);
                    for (let i = 0; i < topicsToShow; i++) {
                        const topic = repo.topics[i];
                        const listItem = document.createElement('li');
                        listItem.classList.add('list-item');
                        listItem.textContent = topic;
                        list.appendChild(listItem);
                    }
                
                    if (repo.topics.length > 5 && window.innerWidth < 768) {
                        const listItem = document.createElement('li');
                        listItem.classList.add('list-item1');
                        listItem.textContent = `+ ${repo.topics.length - 5} More `;
                        list.appendChild(listItem);
                    }
                } else {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-item');
                    listItem.textContent = 'No topics available';
                    list.appendChild(listItem);
                }
                

                column.id = `repo-${repo.id}`;

                row.appendChild(title);
                row.appendChild(description);
                row.appendChild(list);
                column.appendChild(row);
                repoContainer.appendChild(column);
            }
        } else {
            repoContainer.innerHTML = "<p> No repositories found.</p>";
            console.log('Invalid or empty repoData');
        }
    } catch (error) {
        repoContainer.innerHTML = "<p>Error fetching repository details. Please try again later.</p>";
        console.error("Error fetching repo details:", error);
    }
};

const updateRepositoriesPerPage = async () => {
    try {
        const userName = nameValue.value.trim();

        if (userName) {
            const url = `${APIURL}${userName}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();

                // Update the reposPerPage variable
                let reposPerPage = parseInt(document.getElementById('reposPerPage').value, 10) || defaultReposPerPage;

                // Call the updatePagination function with the updated reposPerPage
                updatePagination(currentPage, data, reposPerPage);
            } else {
                console.error(`Error fetching user data. Status: ${response.status}`);
            }
        } else {
            console.error('Invalid user name');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};








const paginationContainer = document.querySelector('.pagination');

function updatePagination(pageNumber, data, reposPerPage) {
    repoContainer.innerHTML = '';
    reposPerPage = reposPerPage || defaultReposPerPage;
    const url = `${APIURL}${data.login}/repos?page=${pageNumber}&per_page=${reposPerPage}`;
    showRepoDetails(url);

    currentPage = pageNumber;
    paginationContainer.innerHTML = '';

    const previousButton = createPaginationButton('Previous', currentPage - 1, data, reposPerPage);
    paginationContainer.appendChild(previousButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = createPaginationItem(i, currentPage, data, reposPerPage);
        paginationContainer.appendChild(pageItem);
    }

    const nextButton = createPaginationButton('Next', currentPage + 1, data, reposPerPage);
    paginationContainer.appendChild(nextButton);
}

function createPaginationItem(pageNumber, currentPage, data) {
    const pageItem = document.createElement('li');
    pageItem.classList.add('page-item');
    if (pageNumber === currentPage) {
        pageItem.classList.add('active');
    }

    const pageLink = document.createElement('a');
    pageLink.classList.add('page-link');
    pageLink.href = '#';
    pageLink.textContent = pageNumber;
    pageLink.addEventListener('click', () => updatePagination(pageNumber, data));

    pageItem.appendChild(pageLink);
    return pageItem;
}

function createPaginationButton(label, targetPage, data) {
    const buttonItem = document.createElement('li');
    buttonItem.classList.add('page-item');

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('page-link');
    buttonLink.href = '#';
    buttonLink.setAttribute('aria-label', label);

    if ((label === 'Previous' && targetPage > 0) || (label === 'Next' && targetPage <= totalPages)) {
        // If it's the "Previous" button and the target page is greater than 0,
        // or it's the "Next" button and the target page is within the total pages
        buttonLink.innerHTML = `<span aria-hidden="true">${label === 'Previous' ? '&laquo;' : '&raquo;'}</span>`;
        buttonLink.addEventListener('click', () => updatePagination(targetPage, data));
    } else {
        // If it's the "Previous" button on the first page or "Next" button on the last page
        buttonLink.classList.add('disabled');
        buttonLink.innerHTML = `<span aria-hidden="true">${label === 'Previous' ? '&laquo;' : '&raquo;'}</span>`;
        // You can also add some visual indication that it's disabled, e.g., changing the color
    }

    buttonItem.appendChild(buttonLink);
    return buttonItem;
}



// Initial update with the first page active
// updatePagination(currentPage);


// Event listener for the search button
searchButton.addEventListener("click", function () {
    console.log("Clicked");
    const userName = nameValue.value.trim();
    console.log(userName);
    if (userName !== "") {
        getDetails(`${APIURL}${userName}`);
    }
});

function isMobileView() {
    return window.innerWidth <= 768; // Adjust the breakpoint as needed
}




getDetails(DeafultURL);




