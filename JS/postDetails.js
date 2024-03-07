const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");



getPost()
function getPost() {
  axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      const post = response.data.data
      const comments = post.comments
      const author = post.author
      document.getElementById("username-span").innerHTML = author.username
      let postTitle = ""
      if (post.title != null) {
        postTitle = post.title
      }
      let commentsContent = ``
      for (let comment of comments) {
        commentsContent +=
          `
            <!--Comment -->
            <div class="p-3 mb-1 rounded" style="background-color: rgb(233, 233, 233)">
              <!-- Username & User photo -->
              <img
                class="rounded-circle"
                style="width: 40px; height: 40px"
                src="${comment.author.profile_image}"
                alt="" />
              <b>@${comment.author.username}</b>
              <!-- // Username & User photo // -->
              <!-- Comment Body  -->
              <div>${comment.body}</div>
              <!-- // Comment Body // --> 
            </div>
        `
      }
      const commentInput = `
            <div id="commentDiv" class="input-group p-1">
              <input
                id='comment-text-input'
                type="text"
                class="form-control"
                placeholder="Write a comment"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"  />
              <button
                class="btn btn-outline-primary"
                type="button"
                id="button-addon2" onclick="createCommentClicked()">
                Send
              </button>
            </div>
      `
      const postContent = `
          <div class="card shadow">
            <div class="card-header">
              <img
                class="rounded-circle border-2"
                style="width: 40px; height: 40px"
                src="${post.author.profile_image}"
                alt="" />
              <b>${post.author.username}</b>
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
            <div id="comments">
            ${commentsContent}
            </div>
            ${commentInput}
          </div>
  `
      document.getElementById('post').innerHTML = postContent
    })
    .catch((error) => {
      console.log(error);
    })
}


function createCommentClicked() {
  let commentBody = document.getElementById('comment-text-input').value

  let params = {
    "body": commentBody
  }
  let token = localStorage.getItem('token')
  const url = `${baseUrl}/posts/${id}/comments`
  axios.post(url, params, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((response) => {
      console.log(response.data)
      showAlert("Posted Successfully")
      getPost()
    })
    .catch((error) => {
      const message = error.response.data.message
      showAlert(message, 'danger')
    });
}