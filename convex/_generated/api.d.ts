/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as contacts from "../contacts.js";
import type * as conversations from "../conversations.js";
import type * as friend_request from "../friend_request.js";
import type * as friend_requests from "../friend_requests.js";
import type * as http from "../http.js";
import type * as status from "../status.js";
import type * as user from "../user.js";
import type * as _utils from "../_utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  contacts: typeof contacts;
  conversations: typeof conversations;
  friend_request: typeof friend_request;
  friend_requests: typeof friend_requests;
  http: typeof http;
  status: typeof status;
  user: typeof user;
  _utils: typeof _utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
