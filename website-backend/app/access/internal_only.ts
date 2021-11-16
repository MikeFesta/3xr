// SPDX-License-Identifier: Apache-2.0
import { Request, Response, NextFunction } from 'express';

export const internalOnlyFilter = (req: Request, res: Response, next: NextFunction) => {
  if (req.ip === 'REDACTED') {
    next();
  } else {
    res.status(403).send('Unauthorized');
  }
};

export default internalOnlyFilter;
