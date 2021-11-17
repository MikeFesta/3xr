// SPDX-License-Identifier: Apache-2.0
import Cors from 'cors';

export const xCors = Cors({
  credentials: true,
  methods: 'GET,HEAD,POST,OPTIONS',
  origin: 'https://www.3xr.com',
  optionsSuccessStatus: 200,
});

export default xCors;
