import { DirectoryManager } from "../directory-manager/DirectoryManager.js";
import { ALLOWED_INPUT_COMMANDS } from "./constants.js";

export class CommandService {
  constructor() {
    this.methodAllocator = this.methodAllocator.bind(this);
    this.directoryManager = new DirectoryManager();
  }

  async methodAllocator({ command, inputPath }) {
    const { CD, UP, LS } = ALLOWED_INPUT_COMMANDS;

    switch (command) {
      case CD:
        await this.directoryManager.changePath(inputPath);
        break;
      case UP:
        await this.directoryManager.goUp(inputPath);
        break;
      case LS:
        await this.directoryManager.displayFilesInTable(inputPath);
        break;
    }
  }
}
