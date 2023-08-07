import { getPosts, getPostUser, addNewPost } from "./api.js";
import { renderUserPostsPageComponent } from "./components/user-post-page-component.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";


export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [
  // { 
  //   id: "64c156c1621cdee2244869be",
	// 	imageUrl: "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1690392252598-12905130104158024.jpg",
	// 	createdAt: "2023-07-26T17:24:17.839Z",
	// 	description: "good day",
	// 	user: {
	// 			id: "64c0f512596b3454a277e86d",
	// 			name: "Анна",
	// 			login: "AnnaIllarionova",
	// 			imageUrl: "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1690367120783-IMG_4169.JPG"
	// 		},
	// 	likes: [],
	// 	isLiked: false,
  // }
];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

        return getPostUser({ token: getToken(), id: data.userId })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          console.log("Открываю страницу пользователя: ", data.userId);
          return renderApp();
        })
        .catch((error) => {
          console.log(error);
        });
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
      addNewPost({
        token: getToken(),
        description: description,
        imageUrl: imageUrl,
      }).then(() => {
        goToPage(POSTS_PAGE);
      });
      console.log("Добавляю пост...", { description, imageUrl });
      goToPage(POSTS_PAGE);
    },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      posts,
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderUserPostsPageComponent({
      appEl,
      posts,
    });
  }
};

goToPage(POSTS_PAGE);
