import os from "os";
import { UserService } from "../services/user-service/UserService.js";
import { DirectoryManager } from "../services/directory-manager/DirectoryManager.js";
import { InputValidator } from "../services/input-validator/InputValidator.js";
import { validCommands } from "../services/input-validator/constants.js";
import { ReadlineService } from "../services/readline-service/ReadlineService.js";
import { CommandService } from "../services/command-service/CommandService.js";
import { displayErrorMessage } from "./helpers.js";
import {
  EXIT_MESSAGE,
  INVALID_INPUT_MESSAGE,
  OPERATION_FAILED_MESSAGE,
} from "./constants.js";

export class App {
  constructor() {
    this.userService = new UserService();

    this.directoryManager = new DirectoryManager();
    this.alertCurrentPath = this.directoryManager.alertCurrentPath;

    this.inputValidator = new InputValidator(validCommands);
    this.validateInput = this.inputValidator.validateInput.bind(
      this.inputValidator,
    );

    this.readlineService = new ReadlineService();
    this.rl = this.readlineService.createReadlineInterface();
    this.asyncQuestion = this.readlineService.promisifyQuestionMethod(this.rl);

    this.commandService = new CommandService();
    this.methodAllocator = this.commandService.methodAllocator;

    this.commandService = new CommandService();
  }

  async runLoop() {
    this.alertCurrentPath();

    try {
      const answer = await this.asyncQuestion("");
      const [command, inputPath] = answer.split(" ");

      const isValidAnswer = this.validateInput(command);

      if (answer === EXIT_MESSAGE) {
        return this.rl.close();
      }

      if (!isValidAnswer) {
        displayErrorMessage(INVALID_INPUT_MESSAGE, 1);
      }

      await this.methodAllocator({
        command,
        inputPath,
      });

      await this.runLoop();
    } catch (error) {
      displayErrorMessage(OPERATION_FAILED_MESSAGE, 0);
      console.log(error);
      await this.runLoop();
    }
  }

  start() {
    const userName = this.userService.getUserName();
    this.userService.greetUser(userName);

    process.chdir(os.homedir());

    this.runLoop();

    this.rl.on("close", () => this.userService.printExitMessage(userName));
  }
}
