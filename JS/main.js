
const baseUrl = "https://tarmeezacademy.com/api/v1"


//Infinite Scroll
let currentPage = 1;
let lastPage = 1;
window.addEventListener("scroll", () => {
  let endPage = window.scrollY + window.innerHeight + 1 >= document.documentElement.scrollHeight;
  if (endPage && currentPage <= lastPage) {
    currentPage++;
    getPosts(false, currentPage);
  }
});


//Scroll Button

// Get the button element
document.addEventListener("DOMContentLoaded", function () {
  // Define the scrollToTop function
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Add event listener to the scroll button
  var scrollBtn = document.getElementById("scrollBtn");
  scrollBtn.addEventListener("click", scrollToTop);

  // Add scroll event listener to show/hide the button
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollBtn.style.display = "flex";
    } else {
      scrollBtn.style.display = "none";
    }
  });
});






// let btn = document.getElementById("scrollBtn")
// console.log(btn)




setupUi()

getPosts()
function getPosts(reload = true, page = 1) {
  toggleLoader(true)
  axios.get(`${baseUrl}/posts?limit=5&page=${page}`)
    .then((response) => {
      toggleLoader(false)
      let posts = response.data.data
      lastPage = response.data.meta.last_page
      if (reload) {
        document.getElementById("posts").innerHTML = ""
      }

      for (let post of posts) {
        // Show Edit Button
        let user = showInfo()
        let isMine = user != null && post.author.id == user.id
        let editButton = ``
        let deleteButton = ``
        if (isMine) {
          editButton =
            `
            <button class="editBtn" onclick="editPostClicked('${encodeURIComponent(JSON.stringify(post))}')">
              <svg height="1em" viewBox="0 0 512 512">
                <path
                  d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </svg>
            </button>
          `
          deleteButton =
            `
            <button class="bin-button" onclick="deletePostButton('${encodeURIComponent(JSON.stringify(post))}')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 39 7"
                class="bin-top"
              >
                <line stroke-width="4" stroke="white" y2="5" x2="39" y1="5"></line>
                <line
                  stroke-width="3"
                  stroke="white"
                  y2="1.5"
                  x2="26.0357"
                  y1="1.5"
                  x1="12"
                ></line>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 33 39"
                class="bin-bottom"
              >
                <mask fill="white" id="path-1-inside-1_8_19">
                  <path
                    d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                  ></path>
                </mask>
                <path
                  mask="url(#path-1-inside-1_8_19)"
                  fill="white"
                  d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                ></path>
                <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
                <path stroke-width="4" stroke="white" d="M21 6V29"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 89 80"
                class="garbage"
              >
                <path
                  fill="white"
                  d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                ></path>
              </svg>
            </button>

            `
        }
        let postTitle = ""
        if (post.title != null) {
          postTitle = post.title
        }
        let card = `
          <div class="card shadow">
            <div class="card-header">
              <span onclick="userClicked(${post.author.id})" style="cursor: pointer;">
                <img
                  class="rounded-circle border-2"
                  style="width: 40px; height: 40px"
                  src="${post.author.profile_image}"
                  alt="" />
                <b>${post.author.username}</b>
              </span>
              ${editButton}
              ${deleteButton}
            </div>
            <div class="card-body" onclick = 'PostClicked(${post.id})' style="cursor:pointer">
              <img
                class="w-100"
                src="${post.image}"
                alt=""  
                style="height: 300px" />
              <h6 class="mt-1" style="color: rgb(170, 170, 170)">
                ${post.created_at}
              </h6>
              <h5>${postTitle}</h5>
              <p>
                ${post.body}
              </p>
              <hr />
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen"
                  viewBox="0 0 16 16">
                  <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                </svg>
                <span>(${post.comments_count}) Comments</span>
              </div>
            </div>
          </div>
  `
        document.getElementById("posts").innerHTML += card
      }
    })
    .catch((error) => {
      console.log(error);
    })
}




function loginBtnClicked() {
  const username = document.getElementById("username-input").value
  const password = document.getElementById("password-input").value
  const params = {
    username: username,
    password: password
  }
  const url = `${baseUrl}/login`
  toggleLoader(true)
  axios.post(url, params)
    .then((response) => {
      // console.log(response.data)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      const modal = document.getElementById("login-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showAlert('Logged in Successfully')
      setupUi()
      updateGreetingMessage(response.data.user.name)
    })
    .catch((error) => {
      const message = error.response.data.message
      showAlert(message, 'danger')
    }).finally(() => {
      toggleLoader(false)
    });
}
// updateGreetingMessage("me5a")

function updateGreetingMessage(username) {
  const helloDiv = document.getElementById("Hello-div")
  if (helloDiv) {
    helloDiv.innerHTML = `Hello, ${username} 👋`
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"))
  if (user) {
    updateGreetingMessage(user.name)
  }
})


function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  setupUi()
  showAlert('Logged out Successfully')
}

function createBtnClicked() {
  let postId = document.getElementById("post-id").value
  let isCreated = postId == null || postId == ""

  const title = document.getElementById("title-post-input").value
  const body = document.getElementById("body-post-input").value
  const image = document.getElementById("image-post-input").files[0]

  const formData = new FormData()
  formData.append("body", body)
  formData.append("title", title)
  formData.append("image", image)

  const token = localStorage.getItem('token')
  let url = ``
  const header = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${token}`
  }


  if (isCreated) {
    url = `${baseUrl}/posts`
  } else {
    formData.append("_method", "put")
    url = `${baseUrl}/posts/${postId}`
  }
  toggleLoader(true)
  axios.post(url, formData, { headers: header })
    .then((response) => {
      const modal = document.getElementById("create-post-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showAlert('New post is created Successfully')
      getPosts()
    })
    .catch((error) => {
      const message = error.response.data.message
      showAlert(message, 'danger')
    }).finally(() => {
      toggleLoader(false)
    });
}


function PostClicked(PostId) {
  window.location = `postDetails.html?postId=${PostId}`
}


function editPostClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject))

  document.getElementById('post-id').value = post.id
  document.getElementById('create-btn').innerHTML = "Update"
  document.getElementById("post-modal-title").innerHTML = 'Edit Post'
  document.getElementById('title-post-input').value = post.title
  document.getElementById('body-post-input').value = post.body
  let postModal = new bootstrap.Modal(document.getElementById('create-post-modal'), {})
  postModal.toggle()
}

function deletePostButton(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject))

  document.getElementById('postId').value = post.id
  let postModal = new bootstrap.Modal(document.getElementById('delete-post-modal'), {})
  postModal.toggle()
}

function confirmDeleting() {
  let postId = document.getElementById('postId').value
  const url = `${baseUrl}/posts/${postId}`
  const token = localStorage.getItem('token')
  const headers = {
    "authorization": `Bearer ${token}`
  }
  toggleLoader(true)
  axios.delete(url, { headers: headers })
    .then((response) => {
      const modal = document.getElementById("delete-post-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showAlert('The post has been deleted')
      getPosts()
    })
    .catch((error) => {
      const message = error.response.data.message
      showAlert(message, 'danger')
    }).finally(() => {
      toggleLoader(false)
    });
}


function addButtonClicked() {
  document.getElementById('post-id').value = ""
  document.getElementById('create-btn').innerHTML = "Create"
  document.getElementById("post-modal-title").innerHTML = 'Create A New Post'
  document.getElementById('title-post-input').value = ""
  document.getElementById('body-post-input').value = ""
  let postModal = new bootstrap.Modal(document.getElementById('create-post-modal'), {})
  postModal.toggle()
}


function profileClicked() {
  const user = showInfo()
  console.log(user)
  const userId = user.id
  window.location = `profile.html?userId=${userId}`
}



function setupUi() {
  const token = localStorage.getItem('token')
  const loginDiv = document.getElementById('login-div')
  const logoutDiv = document.getElementById('logout-div')
  const addBtn = document.getElementById("AddButton")


  if (token == null) { // Not logged in
    if (addBtn != null) {
      addBtn.style.setProperty('display', 'none', 'important')
    }
    loginDiv.style.setProperty('display', 'flex', 'important')
    logoutDiv.style.setProperty('display', 'none', 'important')
  } else { // For logged in user
    if (addBtn != null) {
      addBtn.style.setProperty('display', 'block', 'important')
    }
    loginDiv.style.setProperty('display', 'none', 'important')
    logoutDiv.style.setProperty('display', 'flex', 'important')
    const user = showInfo()
    document.getElementById('nav-username').innerHTML = user.username
    document.getElementById('userProfileImg').src = user.profile_image
  }
}

function showInfo() {
  let user = null
  const userStorage = localStorage.getItem("user")
  if (userStorage != null) {
    user = JSON.parse(userStorage)
  }
  return user
}

function showAlert(customMessage, type = 'success') {
  const alertPlaceholder = document.getElementById('success-alert')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }
  appendAlert(customMessage, type)

  // TODO
  // setTimeout(() => {
  //   const alert = bootstrap.Alert.getOrCreateInstance('#success-alert')
  //   alert.close()
  // }, 2000);
}

function userClicked(userId) {
  window.location = `profile.html?userId=${userId}`
}



function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible"
  } else {
    document.getElementById("loader").style.visibility = "hidden"
  }
}




