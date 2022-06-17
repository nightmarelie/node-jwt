const test = require('ava');
const agent = require('supertest-koa-agent');
const createApp = require('../src/app');

const app = agent(createApp());

test('User can succesfully login', async t => {
  const res = await app.post('/auth/login').send({
    login: 'user',
    password: 'user',
  });
  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');

  const refreshTokenRes = await app.post('/auth/refresh').send({
    refreshToken: res.body.refreshToken,
  });
  t.is(refreshTokenRes.status, 200);
  t.truthy(typeof refreshTokenRes.body.token === 'string');
  t.truthy(typeof refreshTokenRes.body.refreshToken === 'string');
});
