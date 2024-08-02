import { Injectable } from '@nestjs/common'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { EntityManager, Not } from 'typeorm'

type TUniqueConstraintOptions = {
  tableName: string
  column?: string
  ignoreValue?: any | (() => any)
  ignoreColumn?: string
  additionalCondition?: string
  additionalValue?: any
}

@ValidatorConstraint({ async: false })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args: ValidationArguments) {
    if (!value) {
      return true
    }

    const { tableName, additionalCondition, additionalValue }: TUniqueConstraintOptions =
      args.constraints[0]
    const column: string = args.constraints[0].column || args.property
    const ignoreColumn: string = args.constraints[0].ignoreColumn || 'id'
    const ignoreValue =
      typeof args.constraints[0].ignoreValue === 'function'
        ? args.constraints[0].ignoreValue(args.object)
        : args.constraints[0].ignoreValue

    const where: any = {
      [column]: value,
    }
    if (ignoreValue) {
      where[ignoreColumn] = Not(ignoreValue)
    }
    if (additionalCondition && additionalValue) {
      where[additionalCondition] = additionalValue
    }

    const result = await this.entityManager.getRepository(tableName).findOne({
      where,
    })

    return !result
  }

  defaultMessage() {
    return `$property already exists`
  }
}

export function IsUnique(options: TUniqueConstraintOptions, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'is-unique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    })
  }
}
