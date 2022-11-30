import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getConnection, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { BaseService } from './base.service';



@Injectable()
export class TaskService extends BaseService {
  private connection;
  protected queryRunner;
  constructor( 
  ) {
    super();
    this.connection = getConnection();
    this.queryRunner = this.connection.createQueryRunner();
  }

  
}