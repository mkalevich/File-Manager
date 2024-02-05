import readline from "readline";
import { promisify } from "util";

export class ReadlineService {
  createReadlineInterface() {
    const { stdin: input, stdout: output } = process;

    return readline.createInterface({
      input,
      output,
    });
  }

  promisifyQuestionMethod(rl) {
    return promisify(rl.question).bind(rl);
  }
}
