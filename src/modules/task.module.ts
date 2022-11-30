import { Module } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
     
    ]),

  ],
  providers: [
    TaskService,
  ],
})
export class TaskModule {}