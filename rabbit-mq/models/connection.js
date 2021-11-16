// SPDX-License-Identifier: Apache-2.0

module.exports = class Connection {
  constructor() {
    this.credentials = {
      protocol: 'amqp',
      hostname: 'REDACTED',
      port: 5672,
      username: 'REDACTED',
      password: 'REDACTED',
      vhost: 'REDACTED',
    }
  }
}
