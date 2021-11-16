// SPDX-License-Identifier: Apache-2.0
import app from './app';
import Log from '@root/log';

// Note: when using host as the networking mode (docker setting), this value
// needs to be set to 3001 for prod and 3002 for dev
// otherwise, it can be 8080, which is unique to the docker image and forwarded to the system
// as specified in docker-compose.yml (host mode ignores that setting)
const port = process.env.PORT;
app.listen(port, () => {
  Log.info('Express Server listening on port ' + port);
});
