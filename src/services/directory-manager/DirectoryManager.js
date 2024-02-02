import fs from "fs";

export class DirectoryManager {
  alertCurrentPath(directoryPath) {
    return console.log(`You are currently in ${directoryPath}`);
  }

  async checkFileAccessibility(filePath) {
    return new Promise((resolve, _) => {
      fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
