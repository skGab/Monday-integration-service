import { TransferMondayBoards } from './transfer-monday-boards';

describe('Transfer monday boards', () => {
  it('should return the transferred boards"', async () => {
    const systemUnderTest = new TransferMondayBoards();

    data = {};

    const response = await systemUnderTest.execute();
    expect(response).toBeTruthy();
  });
});
