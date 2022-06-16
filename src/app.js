const Koa = require('koa');
const Router = require('koa-router');
const jwtMiddleware = require('koa-jwt');

const config = require('./config');

function createApp() {
  const app = new Koa();
  const router = new Router();
  router.get('/', ctx => {
    ctx.body = 'ok';
  });

  router.use(
    jwtMiddleware({
      secret: config.secret,
    })
  );

  app.use(router.allowedMethods());
  app.use(router.routes());

  return app;
}

if (!module.parent) {
  createApp().listen(config.port);
}

module.exports = createApp;