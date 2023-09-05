import { CreateDatasetService } from './create-dataset.service';
import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BigQuery } from '@google-cloud/bigquery/build/src/bigquery';

abstract class ApiService {
  httpService: HttpService;
  eventEmitter: EventEmitter2;

  abstract run(): Promise<any[] | null>;

  abstract errorEvent(
    cause: string | any,
    place: string,
  ): { source: string; error: string | any };

  abstract apiCall();
}

export class BigQueryService implements ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter2,
    private readonly CreateDatasetService: CreateDatasetService,
  ) {}

  run(): Promise<any[]> {
    const bigqueryCliente = new BigQuery();

    return bigqueryCliente.dataset. 
  }
}
