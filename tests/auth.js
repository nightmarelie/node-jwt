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

test('User can get new access token using refresh token', async t => {
  const res = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_1',
  });
  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');
});

test('User get 404 on invalid refresh token', async t => {
  const res = await app.post('/auth/refresh').send({
    refreshToken: 'INVALID_REFRESH_TOKEN',
  });
  t.is(res.status, 404);
});

test('User can use refresh token only once', async t => {
  const firstResponse = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_ONCE',
  });
  t.is(firstResponse.status, 200);
  t.truthy(typeof firstResponse.body.token === 'string');
  t.truthy(typeof firstResponse.body.refreshToken === 'string');

  const secondResponse = await app.post('/auth/refresh').send({
    refreshToken: 'REFRESH_TOKEN_ONCE',
  });
  t.is(secondResponse.status, 404);
});
