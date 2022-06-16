const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { compareSync } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const userService = require('../services/user');
const refreshTokenService = require('../services/refreshToken');
const config = require('../config');

const router = new Router();

async function issueTokenPair(userId) {
  const newRefreshToken = uuid();
  await refreshTokenService.add({
    token: newRefreshToken,
    userId,
  });

  return {
    token: jwt.sign({ id: userId }, config.secret),
    refreshToken: newRefreshToken,
  };
}

router.post('/login', bodyParser(), async ctx => {
  const { login, password } = ctx.request.body;
  const user = await userService.find({ login });
  if (!user || !compareSync(password, user.password)) {
    const error = new Error();
    error.status = 403;
    throw error;
  }
  ctx.body = await issueTokenPair(user.id);
});

module.exports = router;