import fs from "fs";
import crypto from "crypto";
import zlib from "zlib";
import { DirectoryManager } from "../directory-manager/DirectoryManager.js";
import path from "node:path";
import { UP_COMMAND } from "../directory-manager/constants.js";
import { promisify } from "util";
import { displayMessage } from "../../app/helpers.js";
import {
  COLORS,
  OPERATION_FAILED_MESSAGE,
  OPERATION_SUCCESS_MESSAGE,
} from "../../app/constants.js";

export class FileOperationsService {
  constructor() {
    this.directoryManager = new DirectoryManager();
  }

  async readAndPrintFileContent(pathToFile) {
    await this.directoryManager.changePath(path.join(pathToFile, UP_COMMAND));

    const readStream = fs.createReadStream(pathToFile);
    readStream.on("data", (chunk) => {
      console.log(chunk.toString());
    });

    readStream.on("error", () => {
      console.log(OPERATION_FAILED_MESSAGE, COLORS.RED);
    });
  }

  async createFile(filePath) {
    const writeFile = promisify(fs.writeFile);
    const fileName = path.basename(filePath);

    try {
      await writeFile(filePath, "");

      displayMessage(
        `The file ${fileName} was created successfully`,
        COLORS.GREEN,
      );
    } catch (error) {
      console.log(OPERATION_FAILED_MESSAGE, COLORS.RED);
    }
  }

  async renameFile(filePath, fileName) {
    const rename = promisify(fs.rename);
    const dirPath = path.dirname(filePath);
    const newFilePath = path.join(dirPath, fileName);

    try {
      await rename(filePath, newFilePath);

      displayMessage("Renamed successfully", COLORS.GREEN);
    } catch (error) {
      displayMessage(OPERATION_FAILED_MESSAGE, COLORS.RED);
    }
  }

  copyFile(pathToFile, pathToNewDirectory) {
    const fileName = path.basename(pathToFile);
    const __dirname = path.dirname(fileName);

    const fileDestination = path.join(__dirname, pathToNewDirectory);

    const readableStream = fs.createReadStream(pathToFile);
    const writableStream = fs.createWriteStream(path.resolve(fileDestination));

    readableStream
      .pipe(writableStream)
      .on("finish", () =>
        displayMessage(OPERATION_SUCCESS_MESSAGE, COLORS.GREEN),
      )
      .on("error", (error) => {
        const errorMessage = `${OPERATION_FAILED_MESSAGE}, ${error}`;
        displayMessage(errorMessage, COLORS.RED);
      });
  }

  async removeFile(pathToFile) {
    const unlink = promisify(fs.unlink);

    try {
      await unlink(pathToFile);

      displayMessage(OPERATION_SUCCESS_MESSAGE, COLORS.GREEN);
    } catch (error) {
      const errorMessage = `${OPERATION_FAILED_MESSAGE}, ${error}`;
      displayMessage(errorMessage, COLORS.RED);
    }
  }

  async moveFile(pathToFile, pathToNewDirectory) {
    const fileName = path.basename(pathToFile);
    const __dirname = path.dirname(fileName);

    const fileDestination = path.join(__dirname, pathToNewDirectory, fileName);

    const readableStream = fs.createReadStream(pathToFile);
    const writableStream = fs.createWriteStream(fileDestination);

    readableStream
      .pipe(writableStream)
      .on("finish", async () => {
        await this.removeFile(pathToFile);
      })
      .on("error", (error) => {
        const errorMessage = `${OPERATION_FAILED_MESSAGE}, ${error}`;
        displayMessage(errorMessage, COLORS.RED);
      });
  }

  calculateHash = async (pathToFile) => {
    const hash = crypto.createHash("sha256");

    const readableStream = fs.createReadStream(pathToFile);

    readableStream.on("readable", () => {
      const data = readableStream.read();

      if (data) {
        hash.update(data);
      } else {
        console.log(hash.digest("hex"));
      }
    });
  };

  compress(pathToFile, pathToDestination) {
    const __dirname = path.dirname(pathToFile);
    const pathDestination = path.join(__dirname, pathToDestination);

    const brotliStream = zlib.createBrotliCompress();
    const readableStream = fs.createReadStream(pathToFile);
    const writableStream = fs.createWriteStream(pathDestination);

    readableStream
      .pipe(brotliStream)
      .pipe(writableStream)
      .on("error", (error) => {
        const errorMessage = `${OPERATION_FAILED_MESSAGE}, ${error}`;
        displayMessage(errorMessage, COLORS.RED);
      })
      .on("finish", () => {
        console.log("File compressed successfully!");
      });
  }

  decompress(pathToFile, pathToDestination) {
    const __dirname = path.dirname(pathToFile);
    const pathDestination = path.join(__dirname, pathToDestination);

    const brotliStream = zlib.createBrotliDecompress();
    const readableStream = fs.createReadStream(pathToFile);
    const writableStream = fs.createWriteStream(pathDestination);

    readableStream
      .pipe(brotliStream)
      .pipe(writableStream)
      .on("error", (error) => {
        const errorMessage = `${OPERATION_FAILED_MESSAGE}, ${error}`;
        displayMessage(errorMessage, COLORS.RED);
      })
      .on("finish", () => {
        console.log("File decompressed successfully!");
      });
  }
}
