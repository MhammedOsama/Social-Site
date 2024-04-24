
let current_page = 1;
let last_page = 1;




let sidebar = document.getElementById("offcanvasBody");
sidebar.addEventListener("scroll", () => {
  let endPage = sidebar.scrollTop + sidebar.clientHeight + 1 >= sidebar.scrollHeight;
  if (endPage && current_page < last_page) {
    current_page++;
    getUsers(false, current_page);
  }
});


getUsers();

function getUsers(reload = true, page = 1) {
  toggleLoader(true)
  axios.get(`${baseUrl}/users?limit=15&page=${page}`)
    .then((response) => {
      toggleLoader(false)
      let users = response.data.data;
      last_page = response.data.meta.last_page;
      if (reload) {
        document.getElementById("cards").innerHTML = "";
      }
      for (let user of users) {
        let card = `
      <div class="profileCard" style="cursor: pointer; margin-bottom: 15px">
      <img
      style="
      width: 45px;
      height: 45px;
      border-radius: 50%;
      margin-right: 5px;"
      src="${user.profile_image}"
      alt="" />
      <span
      style="font-weight: 700; font-size: 17px"
      id="username-profile-card">
      ${user.name}
      </span>
      </div>
      `;
        document.getElementById("cards").innerHTML += card;
      }
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      toggleLoader(false);
    });
}


function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible"
  } else {
    document.getElementById("loader").style.visibility = "hidden"
  }
}