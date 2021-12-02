let BASE_AUTH_URL = '';
let BASE_BLOG_URL = '';


if (process.env.NODE_ENV === 'production') {
    BASE_AUTH_URL = "http://128.199.30.219/auth";
    BASE_BLOG_URL = "http://128.199.30.219/blog";
} else {
    BASE_AUTH_URL = "http://localhost:4040/auth";
    BASE_BLOG_URL = "http://localhost:4040/blog";
}

export const basePath = "/";
export const LOGIN_ROUTE = `${BASE_AUTH_URL}/login`;
export const LOGOUT_ROUTE = `${BASE_AUTH_URL}/logout`;
export const REGISTER_ROUTE = `${BASE_AUTH_URL}/register`;

export const BLOG_ADD_ROUTE = `${BASE_BLOG_URL}/add`;
export const BLOG_UPDATE_ROUTE = `${BASE_BLOG_URL}/update`;
export const BLOG_LIST_ROUTE = `${BASE_BLOG_URL}/list`;
export const BLOG_REMOVE_ROUTE = `${BASE_BLOG_URL}/remove`;
