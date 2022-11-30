import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import moment from 'moment';
import { EntityTarget, getConnection } from 'typeorm';

export function IsEducationalYear(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEducationalYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const thisYear = moment().year();
          const fromYear = thisYear - 80;
          value = parseInt(value);
          let toYear = thisYear;
          if (args.property == "to") {
            toYear += 7;
          }

          return fromYear <= value && value <= toYear;
        },
        defaultMessage(args: ValidationArguments) {
          return `The value of field '$property' must be valid educational year.`;
        }
      },
    });
  };
}

export function DateAfter(targetDate: string = null, granularity: moment.unitOfTime.StartOf, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'DateAfter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [targetDate],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let relatedValue;
          if (targetDate) {
            const [relatedPropertyName] = args.constraints;
            relatedValue = (args.object as any)[relatedPropertyName];
          } else {
            // The value must be greater than today
            relatedValue = moment();
          }

          return moment(value.toString()).isAfter(moment(relatedValue.toString()), granularity);
        },
        defaultMessage(args: ValidationArguments) {
          if (targetDate) {
            return `The value of field '$property' must be greater than the value of field '${targetDate}'`;
          } else {
            return `The value of field '$property' must be greater than this ${granularity}`;
          }
        }
      },
    });
  };
}

export function DateFromNow(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'DateFromNow',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let currentDate = new Date()
          currentDate.setHours(0,0,0,0);
          return new Date(value) >= currentDate;
        },
        defaultMessage(args: ValidationArguments) {
            return `The value of field '$property' must start from today`;
          
        }
      },
    });
  };
}

export function IsTextAndNumber(allowNumber: boolean, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsTextAndNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let format;
          if (allowNumber) {
            // Accept text and number
            format = /^[^*|\":<>[\]{}`\\()';@&$]+$/;
          } else {
            // Accept text only
            format = /^[^*|\":<>[\]{}`\\()';@&$0-9]+$/;
          }

          return format.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          if (allowNumber) {
            return `The value of field '$property' must be text and number.`;
          }

          return `The value of field '$property' must be text only.`;
        }
      },
    });
  };
}

export function MaxLengthNumber(length: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'MaxLengthNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value.toString().length <= length;
        },
        defaultMessage(args: ValidationArguments) {
          return `The value of field '$property' must be shorter than or equal to ${length} characters.`;
        }
      },
    });
  };
}

export function IsDateFormat(format: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {

        return moment(value, format).format(format) == value;
        },
        defaultMessage(args: ValidationArguments) {
          return `The value of field '$property' must be valid date format ${format}`;
        }
      },
    });
  };
}

export function Exist(entity: EntityTarget<string>, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Exist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const exist = await getConnection().getRepository(entity).createQueryBuilder()
            .where(`id = :value`, {value: value})
            .getOne();

          return !!exist;
        },
        defaultMessage(args: ValidationArguments) {
          return `$property not exist.`;
        }
      },
    });
  };
}

export function Unique(entity: EntityTarget<string>, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Unique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const exist = await getConnection().getRepository(entity).createQueryBuilder()
            .where(`${args.property} = :value`, {value: value})
            .getOne();

          return !exist;
        },
        defaultMessage(args: ValidationArguments) {
          return `$property must be unique.`;
        }
      },
    });
  };
}

export function GreaterThanOrEqualTo(targetField: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'GreaterThanOrEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [targetField],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          return value >= relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `The value of field '$property' must be greater than or equal to '${targetField}'`;
        }
      },
    });
  };
}