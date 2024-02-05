import { DirectoryManager } from "../directory-manager/DirectoryManager.js";
import { FileOperationsService } from "../file-operations-service/FileOperationsService.js";
import { OperatingSystemService } from "../operation-system-service/OperatingSystemService.js";
import { ALLOWED_INPUT_COMMANDS } from "./constants.js";
import { InputValidator } from "../input-validator/InputValidator.js";
import { displayMessage } from "../../app/helpers.js";
import { COLORS, INVALID_INPUT_MESSAGE } from "../../app/constants.js";

export class CommandService {
  constructor() {
    this.methodAllocator = this.methodAllocator.bind(this);

    this.directoryManager = new DirectoryManager();

    this.fileOperationsService = new FileOperationsService();

    this.operatingSystemService = new OperatingSystemService();

    this.inputValidator = new InputValidator([
      "--EOL",
      "--cpus",
      "--homedir",
      "--username",
      "--architecture",
    ]);
    this.validateInput = this.inputValidator.validateInput.bind(
      this.inputValidator,
    );
  }

  async methodAllocator({ command, firstArg, secondArg, osCommand }) {
    const {
      ADD,
      CAT,
      CD,
      COMPRESS,
      CP,
      DECOMPRESS,
      HASH,
      LS,
      OS,
      RN,
      RM,
      MV,
      UP,
    } = ALLOWED_INPUT_COMMANDS;

    const OPERATING_SYSTEM_COMMANDS = {
      "--EOL": this.operatingSystemService.showEOL,
      "--cpus": this.operatingSystemService.showCpusInfo,
      "--homedir": this.operatingSystemService.showHomeDir,
      "--username": this.operatingSystemService.showSystemUserName,
      "--architecture": this.operatingSystemService.showCPUArchitecture,
    };

    switch (command) {
      case CD:
        await this.directoryManager.changePath(firstArg);
        break;
      case UP:
        await this.directoryManager.goUp(firstArg);
        break;
      case LS:
        await this.directoryManager.displayFilesInTable(firstArg);
        break;
      case CAT:
        await this.fileOperationsService.readAndPrintFileContent(firstArg);
        break;
      case ADD:
        await this.fileOperationsService.createFile(firstArg);
        break;
      case RN:
        await this.fileOperationsService.renameFile(firstArg, secondArg);
        break;
      case CP:
        await this.fileOperationsService.copyFile(firstArg, secondArg);
        break;
      case RM:
        await this.fileOperationsService.removeFile(firstArg);
        break;
      case MV:
        await this.fileOperationsService.moveFile(firstArg, secondArg);
        break;
      case OS:
        const isValidOSCommand = this.validateInput(osCommand);
        if (!isValidOSCommand) {
          displayMessage(INVALID_INPUT_MESSAGE, COLORS.ORANGE);
          break;
        }
        if (OPERATING_SYSTEM_COMMANDS[osCommand]) {
          OPERATING_SYSTEM_COMMANDS[osCommand]();
        }
        break;
      case HASH:
        await this.fileOperationsService.calculateHash(firstArg, secondArg);
        break;
      case COMPRESS:
        await this.fileOperationsService.compress(firstArg, secondArg);
        break;
      case DECOMPRESS:
        await this.fileOperationsService.decompress(firstArg, secondArg);
        break;
    }
  }
}
