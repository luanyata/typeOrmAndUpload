import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import uploadCsv from '../config/uploadCsv';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface TransactionCSV {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const filePath = path.join(uploadCsv.directory, fileName);

    const csvTransactions: TransactionCSV[] = [];
    const transactions: Transaction[] = [];

    const stream = fs
      .createReadStream(filePath)
      .on('error', () => {
        throw new AppError('Error import File');
      })

      .pipe(csvParse({ columns: true, trim: true }))
      .on('data', async row => {
        csvTransactions.push(row);
      });

    await new Promise(resolver => {
      fs.promises.unlink(filePath);
      stream.on('end', resolver);
    });

    const createTransactionService = new CreateTransactionService();

    for (const item of csvTransactions) {
      const transaction = await createTransactionService.execute(item);

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
