// SPDX-License-Identifier: Apache-2.0
import Cors from 'cors';

export const studioCors = Cors({
  credentials: true,
  methods: 'GET,HEAD,POST,OPTIONS',
  origin: 'https://3xr.studio',
  optionsSuccessStatus: 200,
});

export default studioCors;
