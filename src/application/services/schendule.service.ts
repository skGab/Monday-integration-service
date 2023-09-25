import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { TransferBoardsUsecase } from '../usecase/transfer-usecase.service';

// @Injectable()
// export class SchedulerService implements OnModuleInit {
//   private response: Boolean | null = null;
//   private schedulerInitialized: boolean = false;
//   private logger = new Logger(SchedulerService.name);

//   constructor(private transferBoardsUseCase: TransferBoardsUsecase) {}

//   // onModuleInit() {
//   //   if (!this.schedulerInitialized) {
//   //     // SETTING SCHENDULE
//   //     setInterval(async () => {
//   //       // this.response = await this.transferBoardsUseCase.run();

//   //       if (this.response === true) {
//   //         this.logger.warn('Novos dados transferidos para o BigQuery.');
//   //       }

//   //       if (this.response === null) {
//   //         this.logger.warn(
//   //           'Os dados já estão sincronizados, sem novas transferências.',
//   //         );
//   //       }
//   //     }, 60 * 1000);

//   //     this.schedulerInitialized = true;
//   //   }
//   // }

//   getCurrentStatus() {
//     if (this.response === true) {
//       return 'Novos dados transferidos para o BigQuery';
//     } else if (this.response === null) {
//       return 'Os dados já estão sincronizados';
//     } else {
//       return 'Ocorreu um erro durante a última transferência';
//     }
//   }
// }
