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
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += transaction.value;
        } else if (transaction.type === 'outcome') {
          accumulator.outcome += transaction.value;
        }

        return accumulator;
      },
      {
        // inicializaçao do acumulador
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public isTypeValid(type: string): boolean {
    if (type === 'income' || type === 'outcome') {
      return true;
    }
    return false;
  }
}

export default TransactionsRepository;
