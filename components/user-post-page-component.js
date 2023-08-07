import { USER_POSTS_PAGE, AUTH_PAGE } from "../routes.js";
import { renderHeaderComponent, renderHeaderUserComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { addDislike, addLike } from "../api.js";
import { likes } from "./likes-names-components.js";

export function renderUserPostsPageComponent({ appEl, posts }) {
  console.log("Посты",posts);

  function renderUserForm() {
    let postHtml = posts.map((post) => { 
      return `
          <li class="post">
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.id}" class="like-button">
              <img src="${(post.isLiked) ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}">
              </button>
              <p class="post-likes-text">Нравится: <strong>${likes(post.likes)}</strong></p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span> ${post.description}</p>
            <p class="post-date">${post.createdAt}</p>
          </li>`
    }).join("");

    const appHtml = 
      `<div class="page-container">
        <div class="header-container"></div>
        <div class="posts-user-header"></div>
        <ul class="posts">
        ${postHtml}
        </ul>
      </div>`
    ;

    appEl.innerHTML = appHtml;

    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      });
    }

    renderHeaderUserComponent({
      element: document.querySelector(".posts-user-header"), posts
    });

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    initLikeListeners();
  }

  const initLikeListeners = () => {
    const likeButtons = document.querySelectorAll(".like-button");
    likeButtons.forEach((likeButton) => {
      likeButton.addEventListener("click", () => {
        console.log('click')
        let postId = likeButton.dataset.postId;
        let index = posts.findIndex((el) => el.id === postId);

        if (user) {
          if (posts[index].isLiked) {
            addDislike({
              token: `Bearer ${user.token}`,
              id: postId,
            })
              .then(() => {
                posts[index].isLiked = false;
                posts[index].likes.splice(posts[index].likes.findIndex((el) => el.id === user._id),1);
                USER_POSTS_PAGE;
                renderUserForm(); 
                //console.log('dislike',posts[index].likes);
              })
              .catch((error) => {
                console.error(error.message);
              });   
          } else {
            addLike({
              token: `Bearer ${user.token}`,
              id: postId,
            })
              .then(() => {
                posts[index].isLiked = true;
                posts[index].likes.push({
                  id: user._id,
                  name: user.name,
                });
                USER_POSTS_PAGE;
                renderUserForm();
                //console.log('like',posts[index].likes);
              }).catch((error) => {
                console.error(error.message);
              });     
          }
        } else {
          alert("Только авторизованные пользователи могут ставить лайки");
          goToPage(AUTH_PAGE);
        }
      });
    });
  }
  initLikeListeners();
  renderUserForm()
}