import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findTransactions = await this.find();

    if (!findTransactions) {
      return { income: 0, outcome: 0, total: 0 } as Balance;
    }

    const income = findTransactions
      .filter(transaction => transaction.type === 'income')
      .reduce((soma, item) => soma + item.value, 0);

    const outcome = findTransactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((soma, item) => soma + item.value, 0);

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
