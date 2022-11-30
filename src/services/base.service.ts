import { HttpException } from '@nestjs/common';
import moment from 'moment-timezone';
import { QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { constants } from '../constants/constant';

export class BaseService {
  responseOk(data: any = null, msg: string = null) {
    let response = {
      success: true,
      message: msg,
      data: data,
    }
    if (!data) {
      delete response.data;
      if (!msg) {
        delete response.message;
      }
    } else {
      delete response.success;
      if (!msg) {
        response = data;
      }
    }

    return response;
  }

  responseErr(code: number = 500, msg: string = 'Internal Server Error', data: any = null) {
    const res = {
      statusCode: code,
      message: msg,
    }
    if (data) {
      res['data'] = data;
    }

    throw new HttpException(res, code);
  }

  makeExpired(number, unit = 'days') {
    return moment().add(number, unit).toDate();
  }

  convertUTCToLocale(time) {
    return moment.tz(time, 'UTC').local().format('YYYY-MM-DD HH:mm:ss');
  }

  async customPaginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = constants.PAGINATION.PAGE_DEFAULT,
    limit: number = constants.PAGINATION.LIMIT_DEFAULT,
  ) {
    page = +page;
    limit = +limit;
    const start = (page - 1) * limit;
    const result = await queryBuilder
      .skip(start)
      .take(limit)
      .getManyAndCount();
    const items = result[0];
    const totalItems = result[1];
    const totalPage = Math.ceil(totalItems/limit);

    return {
      items: items,
      meta: {
        "totalItems": totalItems,
        "itemCount": items.length,
        "itemsPerPage": limit,
        "totalPages": totalPage,
        "currentPage": page,
      }
    }
  }

// return an array of date objects for start (monday)
// and end (sunday) of week based on supplied 
// date object or current date
  startAndEndOfWeek(date: Date) {
    // If no date object supplied, use current date
    // Copy date so don't modify supplied date
    let now = date? new Date(date) : new Date();
    now.setHours(0,0,0,0);
    const startOfPeriod = moment(now)
    let monday = startOfPeriod.clone().weekday(1).toDate()
    let sunday = startOfPeriod.clone().weekday(7).toDate()
    return [monday, sunday];
  }

  getNumberOfWeek(startDate: Date,endDate: Date) {
    let firstMonday = this.startAndEndOfWeek(startDate)[0];
    let lastSunday = this.startAndEndOfWeek(endDate)[1];
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.round(Math.abs(lastSunday.getTime() - firstMonday.getTime()) / msInWeek);
  }
}
