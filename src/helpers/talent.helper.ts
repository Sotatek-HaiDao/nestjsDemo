export class TalentHelper {
  canUpdateSignupStep(currentStep, targetStep) {
    return currentStep == targetStep || currentStep == targetStep - 1;
  }
}