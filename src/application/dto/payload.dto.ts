import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { TransferResponse } from 'src/domain/repository/bigQuery-repository';

interface Status {
  step: string;
  success: boolean;
  error?: string;
}

interface Body {
  count: number;
  names: string[];
  message?: string;
}

interface Transfer {
  newItems: Body;
  updatedItems: Body;
  excludedItems: Body;
}

export class PayloadDto {
  private boards: Body;
  private datasetsNames: string[] = [];
  private tablesNames: string[] = [];
  private transfers: Transfer;
  private status: Status[] = [];

  // prazo de entrega realizado
  // prazo de entrega solicitado

  updateStatus(newStatus: Status): void {
    this.status.push(newStatus);
  }

  addTable(table: any): void {
    this.tablesNames.push(table);
  }

  addBoard(mondayBoards: Board[]): void {
    const board = {
      count: mondayBoards.length,
      names: mondayBoards.map((mBoard) => mBoard.getBoardName()),
    };

    this.boards = board;
  }

  addDataset(datasets: string[]): void {
    this.datasetsNames = [...this.datasetsNames, ...datasets];
  }

  addTransfer(
    newItemsStatus?: TransferResponse,
    updatedItemsStatus?: string[],
  ): void {
    const transfer: Transfer = {
      newItems: { count: 0, names: [] },
      updatedItems: { count: 0, names: [] },
      excludedItems: { count: 0, names: [] },
    };

    if (!newItemsStatus) {
      transfer.newItems.message = 'Nenhum Item novo para ser inserido';
    } else {
      transfer.newItems = {
        count: newItemsStatus.insertedPayload.length,
        names: newItemsStatus.insertedPayload.map((item) => item.solicitacao),
      };
    }

    // if (updatedItemsStatus) {
    //   transfer.updatedItems = {
    //     count: updatedItemsStatus.updatedPayload.length, // Assuming you have updatedPayload
    //     names: updatedItemsStatus.updatedPayload.map(
    //       (item) => item.solicitacao,
    //     ), // Assuming you have updatedPayload
    //   };
    // }

    this.transfers = transfer;
  }
}
