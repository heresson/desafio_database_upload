import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // Fazer Repository
    const transactionRepository = getCustomRepository(TransactionRepository);

    const createCategoryService = new CreateCategoryService();
    const categorySaved = await createCategoryService.execute({
      title: category,
    });

    // valida type
    const isTypeOK = await transactionRepository.isTypeValid(type);
    if (!isTypeOK) {
      throw new AppError(
        "Invalid Type, must have 'income' or 'outcome' as value",
      );
    }

    const { total } = await transactionRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError("You don't have enough balance.");
    }

    // create transaction
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categorySaved,
    });

    // save transaction
    await transactionRepository.save(transaction);

    return transaction;

    // return
  }
}

export default CreateTransactionService;
