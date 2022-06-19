const Router = require('koa-router');
const { list } = require('../services/user');

const router = new Router();

router.get('/', async ctx => {
  const data = await list();
  ctx.body = data;
});

module.exports = router;