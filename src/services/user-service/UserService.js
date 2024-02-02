import { ANONYMOUS, usernamePrefix } from "./constants.js";

export class UserService {
  getUserName() {
    const { argv } = process;

    const commandLineArguments = argv.slice(2);

    const userNameArgument = commandLineArguments.find((argument) =>
      argument.startsWith(usernamePrefix),
    );

    if (userNameArgument) {
      const [_, username] = userNameArgument.split("=");

      return username;
    }

    return ANONYMOUS;
  }

  greetUser(username) {
    return console.log(`Welcome to the File Manager, ${username}!`);
  }

  printExitMessage(username) {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  }
}
