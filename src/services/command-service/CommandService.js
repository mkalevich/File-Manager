import { DirectoryManager } from "../directory-manager/DirectoryManager.js";
import { ALLOWED_INPUT_COMMANDS } from "./constants.js";
import { FileOperationsService } from "../file-operations-service/FileOperationsService.js";
import { OperatingSystemService } from "../operation-system-service/OperatingSystemService.js";

export class CommandService {
  constructor() {
    this.methodAllocator = this.methodAllocator.bind(this);
    this.directoryManager = new DirectoryManager();

    this.fileOperationsService = new FileOperationsService();

    this.operatingSystemService = new OperatingSystemService();
  }

  async methodAllocator({ command, absolutePath, secondArg, firstArg }) {
    const {
      ADD,
      CD,
      CP,
      COMPRESS,
      DECOMPRESS,
      UP,
      LS,
      CAT,
      RN,
      RM,
      MV,
      OS,
      HASH,
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
        await this.directoryManager.changePath(absolutePath);
        break;
      case UP:
        await this.directoryManager.goUp(absolutePath);
        break;
      case LS:
        await this.directoryManager.displayFilesInTable(absolutePath);
        break;
      case CAT:
        await this.fileOperationsService.readAndPrintFileContent(absolutePath);
        break;
      case ADD:
        await this.fileOperationsService.createFile(absolutePath);
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
        if (OPERATING_SYSTEM_COMMANDS[firstArg]) {
          OPERATING_SYSTEM_COMMANDS[firstArg]();
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
