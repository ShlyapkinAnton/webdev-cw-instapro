import { sanitizeHtml } from "./sanitizeHtml.js";

const personalKey = "prod"; //anton-shlyapkin 
const baseHost = "https://wedev-api.sky.pro"; //"https://webdev-hw-api.vercel.app"
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login: sanitizeHtml(login),
      password: sanitizeHtml(password),
      name: sanitizeHtml(name),
      imageUrl: sanitizeHtml(imageUrl),
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login: sanitizeHtml(login),
      password: sanitizeHtml(password),
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  })
}

export function getPostUser({ token, id}) {
  return fetch( `${postsHost}/user-posts/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    return response.json();
  }).then((data) => {
    console.log(data.posts);
    return data.posts;
  });
}

export function addLike({ token, id }) {
  return fetch(`${postsHost}/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("ошибка");
    }
  });
}
export function addDislike({ token, id }) {
  return fetch(`${postsHost}/${id}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("ошибка");
    }
  });
}

export function addNewPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description: sanitizeHtml(description),   
      imageUrl: sanitizeHtml(imageUrl),
    }),
  }).then((response) => {
    if (response.status === 400) {
      alert("Не все поля были заполнены")
      throw new Error("Что-то не заполнено");
    }
    return response.json();
  });
}
