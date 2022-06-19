

const { test } = require('ava');
const agent = require('supertest-koa-agent');
const createApp = require('../src/app');
const issueToken = require('./helpers/issueToken');

const app = agent(createApp());
const authLine = `Bearer ${issueToken({ id: 1 })}`;

test('Users list', async t => {
  const res = await app.get('/users').set('Authorization', authLine);
  t.is(res.status, 200);
  t.truthy(Array.isArray(res.body));
});
