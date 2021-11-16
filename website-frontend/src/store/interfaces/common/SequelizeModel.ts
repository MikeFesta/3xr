// SPDX-License-Identifier: Apache-2.0
import { formatDateMMDDYYYY, formatDateMMDDYYYYHHMM } from '@/helpers';

export interface SequelizeModelInterface {
  createdAt: Date;
  createdAtFormatted: string;
  dateCreated: string;
  dateUpdated: string;
  id: number;
  updatedAt: Date;
  updatedAtFormatted: string;
}

export default class SequelizeModel implements SequelizeModelInterface {
  createdAt: Date = new Date();
  createdAtFormatted: string = '';
  dateCreated: string = '';
  id: number = 0;
  updatedAt: Date = new Date();
  updatedAtFormatted: string = '';
  dateUpdated: string = '';

  constructor(data: any) {
    if (data) {
      this.createdAt = data.createdAt;
      this.createdAtFormatted = formatDateMMDDYYYYHHMM(data.createdAt);
      this.dateCreated = formatDateMMDDYYYY(data.createdAt);
      this.dateUpdated = formatDateMMDDYYYY(data.createdAt);
      this.id = data.id;
      this.updatedAt = data.updatedAt;
      this.updatedAtFormatted = formatDateMMDDYYYYHHMM(data.updatedAt);
    }
  }
}
