import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MondayResponseVo } from 'src/domain/monday/monday-vo';
import { CallApiService } from './util/call-api.service';

@Injectable()
export class MondayService {
  private logger = new Logger(MondayService.name);

  constructor(private callApiService: CallApiService) {}

  // RUNNING THE MAIN FUNCTION
  async run(): Promise<MondayResponseVo | null> {
    try {
      const { data } = await lastValueFrom(this.callApiService.run());

      return data;
    } catch (error) {
      this.logger.error(error);

      return null;
    }
  }
}
