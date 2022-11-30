export class EmployerHelper {
  canUpdateOnboardStep(currentStep, targetStep) {
    return currentStep == targetStep || currentStep == targetStep - 1;
  }
}