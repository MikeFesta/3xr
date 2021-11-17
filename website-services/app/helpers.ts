// SPDX-License-Identifier: Apache-2.0
class Helpers {
  public getRandomString(length: number): string {
    return (
      Math.random()
        .toString(36)
        .substring(2, length) +
      Math.random()
        .toString(36)
        .substring(2, length)
    );
  }
}

module.exports = new Helpers();
export default new Helpers();
