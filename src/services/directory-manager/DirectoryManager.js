import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import { displayMessage } from "../../app/helpers.js";
import { getPreparedTableFiles, sortFiles } from "./helpers.js";
import { NO_SUCH_DIRECTORY_MESSAGE } from "../command-service/constants.js";
import { CANT_GO_HIGHER_MESSAGE, UP_COMMAND } from "./constants.js";
import { COLORS, OPERATION_FAILED_MESSAGE } from "../../app/constants.js";

export class DirectoryManager {
  alertCurrentPath() {
    return console.log(`You are currently in ${process.cwd()}`);
  }

  async checkFileAccessibility(filePath) {
    const access = promisify(fs.access);
    const error = await access(filePath);

    return !error;
  }

  async changePath(filePath) {
    const fp = path.resolve(process.cwd(), filePath);

    const isExists = await this.checkFileAccessibility(fp);

    if (isExists) {
      process.chdir(fp);
    } else {
      displayMessage(NO_SUCH_DIRECTORY_MESSAGE, COLORS.ORANGE);
    }
  }

  async goUp() {
    const isInHomeDirectory = process.cwd() === os.homedir();

    if (isInHomeDirectory) {
      displayMessage(CANT_GO_HIGHER_MESSAGE, COLORS.ORANGE);
    } else {
      process.chdir(UP_COMMAND);
    }
  }

  async displayFilesInTable() {
    const readdir = promisify(fs.readdir);

    try {
      const cwd = process.cwd();
      const allFiles = await readdir(cwd);

      const preparedTableFiles = await getPreparedTableFiles(allFiles, cwd);

      console.table(sortFiles(preparedTableFiles));
    } catch (error) {
      console.log(OPERATION_FAILED_MESSAGE, COLORS.RED);
    }
  }
}
