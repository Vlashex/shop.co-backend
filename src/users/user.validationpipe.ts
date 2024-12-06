import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';


@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.safeParse(value);
    console.log(error)
    if (error) {
      throw new BadRequestException({
        status: 400,
        statusText: 'Validation failed'
      });
    }
    return value;
  }
}

