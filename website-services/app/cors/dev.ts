// SPDX-License-Identifier: Apache-2.0
import Cors from 'cors';

export const devCors = Cors({
  credentials: true,
  methods: 'GET,HEAD,POST,OPTIONS',
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
});

export default devCors;
