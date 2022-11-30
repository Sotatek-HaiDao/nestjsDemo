import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "./base.service";

@Injectable()
export class CommonService extends BaseService {
    constructor(
      ) {
        super();
      }
         
} 