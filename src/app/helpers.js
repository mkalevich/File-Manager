import { ERROR_MESSAGE_COLOR } from "./constants.js";

export const displayErrorMessage = (message, color) => {
  console.log(ERROR_MESSAGE_COLOR[color], message);
};
