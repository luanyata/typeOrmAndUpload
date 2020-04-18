import { getCustomRepository } from 'typeorm';
import validate from 'uuid-validate';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (!validate(id)) {
      throw new AppError('Transaction not found', 400);
    }
    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found', 400);
    }

    await transactionRepository.remove(transaction);

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
