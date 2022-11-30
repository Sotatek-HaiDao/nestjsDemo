import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EmployerOnboardGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
  ) {
    super();
  }

  handleRequest(err, user, info: Error, context: ExecutionContext) {
    const step = this.reflector.getAllAndOverride<number>('employer_onboard_step', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!step) {
      return user;
    }

    const currentStep = user.employer.onboardStep || 0;
    if (step - currentStep > 1) {
      const onboardStepRedirect = currentStep + 1;
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: `Please return to step ${onboardStepRedirect} of onboard screen.`,
        onboardStepRedirect: onboardStepRedirect,
      });
    }

    return user;
  }
}