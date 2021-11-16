// SPDX-License-Identifier: Apache-2.0
import axios from 'axios';

export default axios.create({
  baseURL: 'https://x.3xr.com/',
  method: 'GET',
  responseType: 'blob',
});
