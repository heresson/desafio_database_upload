import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateCategoryService from '../services/CreateCategoryService';
import Category from '../models/Category';

const categoriesRouter = Router();

categoriesRouter.post('/', async (req, res) => {
  const { title } = req.body;

  const createCategoryService = new CreateCategoryService();

  const category = await createCategoryService.execute({ title });

  return res.json(category);
});

categoriesRouter.get('/', async (req, res) => {
  const categoriesRepo = getRepository(Category);
  const categories = await categoriesRepo.find();
  return res.json(categories);
});

export default categoriesRouter;
