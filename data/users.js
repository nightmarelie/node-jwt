const { hashSync } = require('bcryptjs');

module.exports = [
  {
    id: 1,
    login: 'User1',
    password: hashSync('User1'),
  },
  {
    id: 2,
    login: 'User2',
    password: hashSync('User2'),
  },
];
