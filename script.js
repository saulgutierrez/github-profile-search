const apiBaseURL = `https://api.github.com/users`;

const errorMessage = (status) => {
    const messageDiv = document.querySelector("#message");
    let errmsg = ``;
    if (status == 404) { // If user does not exists, shows up a message
        errmsg = `<div class="alert alert-danger text-center">Profile doesn't exists.</div>`;
    }
    messageDiv.innerHTML = errmsg;
    setTimeout(() => (messageDiv.innerHTML = ``), 5000);
}

// Get Github profile
// Async function because are feching data from API, and it takes a while
// Login is the username on the API
const getGithubProfile = async(login) => {
    try {
        // Try to get the data from the API
        const response = await fetch(`${apiBaseURL}/${login}`);
        if (response.status !== 200) {
            if (response.status === 404) {
                errorMessage(response.status);
            }
            new Error(`Something went wrong. Status Code: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
}

const getGitRepos = async(login) => {
    try {
        // Try to get the data from the API
        const response = await fetch(`${apiBaseURL}/${login}/repos`);
        if (response.status !== 200) {
            new Error(`Something went wrong. Status Code: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
};

const renderProfile = (data) => {
    let profileSnniped = ``;
    profileSnniped += `
                        <div class="profile-userpic">
                            <img src="${data.avatar_url}" class="d-block">
                        </div>
                        <div class="profile-usertitle">
    `;

    if(data.name !== null) {
        profileSnniped += `<div class="profile-usertitle-name">${data.name}</div>`
    }

    profileSnniped += `
                        <div class="profile-usertitle-job">
                        ${data.login}
                        </div>
                        </div>
                        <div class="portlet light bordered">
                            <!-- STAT -->
                            <div class="row list-separated profile-stat">
                                <div class="col-md-6 col-sm-6 col-xs-6">
                                    <div class="uppercase profile-stat-title">${data.followers}</div>
                                    <div class="uppercase profile-stat-text">Followers</div>
                                </div>
                                <div class="col-md-6 col-sm-6 col-xs-6">
                                    <div class="uppercase profile-stat-title">${data.following}</div>
                                    <div class="uppercase profile-stat-text">Following</div>
                                </div>
                            </div>
    `;

    if (data.bio !== null) {
        profileSnniped += `<div><h4 class"profile-desc-title">About ${data.name}</h4>
        <span class="profile-desc-text">${data.bio}</span></div>`;
    }

    if (data.twitter_username !== null) {
        profileSnniped += `<div class="margin-top-20 profile-desc-link">
        <i class="fab fa-twitter"></i>
        <a target="_blank" href="https://twitter.com/${data.twitter_username}">@${data.twitter_username}<a/>
        </div>`;
    }

    profileSnniped += `</div>`;
    // Append to the HTML Document
    document.querySelector("#profile").innerHTML = profileSnniped;
};

// List Git Repos
const listRepos = (repos) => {
    let reposList = ``;
    if (repos.length > 0) {
        repos.forEach((repo) => {
            reposList += `<li class="mb-3 d-flex flex-content-stretch col-12 col-md-6 col-lg-6">
            <div class="card" style="width: 22.5rem;">
            <div class="card-body">
            <h5 class="card-title"><a target="_blank" href="${repo.html_url}">${repo.name}</a></h5>
            <p class="card-text">${repo.description !== null ? repo.description : ""}</p>
            <p>`;
            if(repo.language !== null) {
                reposList += `
                                <i class="fas fa-circle ${repo.language ? repo.language.toLowerCase() : ""}"></i> ${repo.language}
                `;
            }

            reposList += `<i class="far fa-star"></i> ${repo.stargazers_count}</p>
            </div>
            </div>
            </li>`;
        })
    }

    document.querySelector("#repos").innerHTML = reposList;
};

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("#searchForm");
    searchForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const searchInput = document.querySelector("#searchInput");
        const gitHubLogin = searchInput.value.trim(); // Remove all the void spaces

        if(gitHubLogin.length > 0) {
            const userProfile = await getGithubProfile(gitHubLogin);
            if(userProfile.login) {
                const gitRepos = await getGitRepos(gitHubLogin);
                renderProfile(userProfile);
                listRepos(gitRepos);
                // When click on search button, the search bar gone
                document.querySelector(".searchblock").style.display = "none";
                // The profile of the user is display up
                document.querySelector(".profile").style.display = "block";
            }
        }
    });
});