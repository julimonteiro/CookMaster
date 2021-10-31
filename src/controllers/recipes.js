const jwt = require('jsonwebtoken');
const Services = require('../services/recipes');

const secret = 'senha';

const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

const create = async (req, res) => {
  const { name, ingredients, preparation } = req.body;
  const token = req.headers.authorization;

  try {
    const verifiedToken = jwt.verify(token, secret, jwtConfig);
    const { _id } = verifiedToken.userWithoutPassword;

    const isValidToCreate = await Services.create(name, ingredients, preparation, _id);

    if (isValidToCreate.err) {
      const { message, code } = isValidToCreate.err;
      return res.status(code).json({ message });
    }

    return res.status(201).json(isValidToCreate);
  } catch (e) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

const findAll = async (_req, res) => {
  const recipes = await Services.findAll();
  return res.status(200).json(recipes);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const recipes = await Services.findById(id);
  if (recipes.err) {
    const { message, code } = recipes.err;
    return res.status(code).json({ message });
  }
  return res.status(200).json(recipes);
};

module.exports = {
  create,
  findAll,
  findById,
};