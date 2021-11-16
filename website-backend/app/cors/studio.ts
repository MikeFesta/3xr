// SPDX-License-Identifier: Apache-2.0
import Cors from 'cors';

export const studioCors = Cors({
  credentials: true,
  methods: 'GET,HEAD,POST,OPTIONS',
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
});

export default studioCors;
