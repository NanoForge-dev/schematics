/**
 * @typedef {import("@nanoforge-dev/core").NanoforgeClient} NanoforgeClient
 */

/**
 * Actions that are executed before the application initialization
 * But are executed after base libraries addition
 * @param {NanoforgeClient} app - Nanoforge client instance
 * @returns {Promise<void>}
 */
export async function beforeInit(app) {
  // Actions before app initialization
}
