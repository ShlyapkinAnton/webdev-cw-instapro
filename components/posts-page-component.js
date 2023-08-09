import { USER_POSTS_PAGE, AUTH_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { addDislike, addLike } from "../api.js";
import { likes } from "./likes-names-components.js";
import { formatDistanceToNow } from "date-fns";

export function renderPostsPageComponent({ appEl, posts }) {
  console.log("Актуальный список постов:", posts);
  function renderPosts() {
    let postHtml = posts.map((post) => { 
      return `<div class="page-container">
      <div class="header-container"></div>
        <ul class="posts">
          <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
            </div>
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
            <p class="post-date">${formatDistanceToNow(new Date(post.createdAt), {includeSeconds: true})}</p>
          </li>
        </ul>
      </div> `
    }).join("");

    const appHtml = 
      `<div class="page-container">
        <div class="header-container"></div>
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
                posts[index].likes.splice(
                  posts[index].likes.findIndex((el) => el.id === user._id),
                  1
                );
                renderPosts();
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
                renderPosts();
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
  renderPosts()
}
