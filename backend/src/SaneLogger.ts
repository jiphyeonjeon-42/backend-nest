import { ConsoleLogger, LoggerService } from '@nestjs/common';

export class SaneLogger extends ConsoleLogger implements LoggerService {
  protected override getTimestamp() {
    return new Date()
      .toISOString()
      .replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).*/g, '$1 $2');
  }
}
