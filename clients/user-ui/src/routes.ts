/**
 * These routes are public and don't need authentication
 * @type {string[]}
 * */
export const publicRoutes = ["/", "/signin"];

/**
 * These routes are protected and need authentication
 * @type {string[]}
 * */
export const authPages = ["/auth/signin", "/auth/signup"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for api
 * authentication purposes
 * @type {string}
 * */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path for logged-in users
 * @type {string}
 * */
export const DEFAULT_LOGIN_REDIRECT = "/";
