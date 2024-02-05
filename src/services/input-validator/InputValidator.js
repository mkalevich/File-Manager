export class InputValidator {
  constructor(validCommands) {
    this.validCommands = validCommands;
  }

  validateInput(command) {
    return this.validCommands.some((validCommand) => command === validCommand);
  }
}
