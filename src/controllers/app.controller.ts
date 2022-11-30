import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Public } from '../utils/decorators/public';

@Public()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
