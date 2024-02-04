import fs from "fs";
import path from "path";
import { displayErrorMessage } from "../../app/helpers.js";
import { NO_SUCH_DIRECTORY_MESSAGE } from "../command-service/constants.js";
import os from "os";
import { promisify } from "util";
import { CANT_GO_HIGHER_MESSAGE, UP_COMMAND } from "./constants.js";
import { getPreparedTableFiles, sortFiles } from "./helpers.js";

export class DirectoryManager {
  alertCurrentPath() {
    return console.log(`You are currently in ${process.cwd()}`);
  }

  async checkFileAccessibility(filePath) {
    const access = promisify(fs.access);
    const error = await access(filePath);

    return !error;
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

  async goUp() {
    const isInHomeDirectory = process.cwd() === os.homedir();

    if (isInHomeDirectory) {
      displayErrorMessage(CANT_GO_HIGHER_MESSAGE, 1);
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
      console.log("Something went wrong");
    }
  }
}
