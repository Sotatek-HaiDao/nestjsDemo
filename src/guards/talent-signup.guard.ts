import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TalentSignupGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
  ) {
    super();
  }

  handleRequest(err, user, info: Error, context: ExecutionContext) {
    const step = this.reflector.getAllAndOverride<number>('talent_signup_step', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!step) {
      return user;
    }

    const currentStep = user.talent.signupStep;
    if (!currentStep) {
      throw new ForbiddenException();
    }
    if (step - currentStep > 1) {
      const signupStepRedirect = currentStep + 1;
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: `Please return to step ${signupStepRedirect} of create profile screen.`,
        signupStepRedirect: signupStepRedirect,
      });
    }

    return user;
  }
}