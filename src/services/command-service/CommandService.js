import path from "path";
import { DirectoryManager } from "../directory-manager/DirectoryManager.js";
import {
  ALLOWED_INPUT_COMMANDS,
  NO_SUCH_DIRECTORY_MESSAGE,
} from "./constants.js";
import { displayErrorMessage } from "../../app/helpers.js";

export class CommandService {
  constructor() {
    this.methodAllocator = this.methodAllocator.bind(this);

    this.directoryManager = new DirectoryManager();
    this.checkFileAccessibility = this.directoryManager.checkFileAccessibility;
  }
  async methodAllocator({ command, inputPath }) {
    const { CD } = ALLOWED_INPUT_COMMANDS;

    switch (command) {
      case CD:
        await this.changePath(inputPath);
        break;
    }
  }

  async changePath(inputPath) {
    const absolutePath = path.resolve(inputPath ?? "");

    const isExists = await this.checkFileAccessibility(absolutePath);

    if (isExists) {
      process.chdir(absolutePath);
    } else {
      displayErrorMessage(NO_SUCH_DIRECTORY_MESSAGE, 1);
    }
  }
}
