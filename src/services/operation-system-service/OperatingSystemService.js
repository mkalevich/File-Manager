import os from "node:os";
import { displayMessage } from "../../app/helpers.js";
import { COLORS } from "../../app/constants.js";

export class OperatingSystemService {
  showEOL() {
    displayMessage(JSON.stringify(os.EOL), COLORS.GREEN);
  }

  showCpusInfo() {
    const cpus = os.cpus();
    displayMessage(`Overall amount of CPUs: ${cpus.length}`, COLORS.GREEN);

    cpus.forEach((cpu, index) => {
      console.log(`CPU ${index}:`);
      console.log(`\tModel: ${cpu.model}`);
      console.log(`\tSpeed: ${cpu.speed / 1000} GHz`);
    });
  }

  showHomeDir() {
    displayMessage(`Home directory: ${os.homedir()}`, COLORS.GREEN);
  }

  showSystemUserName() {
    displayMessage(
      `System user name: ${JSON.stringify(os.userInfo().username)}`,
      COLORS.GREEN,
    );
  }

  showCPUArchitecture() {
    displayMessage(`CPU Architecture: ${os.arch()}`, COLORS.GREEN);
  }
}
