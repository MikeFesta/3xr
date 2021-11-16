// SPDX-License-Identifier: Apache-2.0
import { CommentInterface } from '@/store/interfaces/Comment';

export const arrayUniqueItemsFilter = function <a>(value: a, index: number, self: a[]) {
  return self.indexOf(value) === index;
};

export const reverseChildComments = (collection: CommentInterface[] = []) => {
  return collection.map(comment => {
    if (comment.childComment) {
      return {
        ...comment,
        childComment: comment.childComment.slice().reverse(),
      };
    }
    return comment;
  });
};

export const getCommentHashId = (hash: string): number => {
  try {
    return parseInt(hash.split('#comment-')[1]);
  } catch {
    return 0;
  }
};

export const numberToTwoDigitHex = (val: number): string => {
  const hex = val.toString(16);
  return hex.length == 1 ? '0' + hex : hex.slice(-2);
};

export const formatDateMMDDYYYY = (dateString: string): string => {
  const d = new Date(dateString);
  return (
    (d.getMonth() + 1).toString() +
    '/' +
    d.getDate() +
    '/' +
    d
      .getFullYear()
      .toString()
      .substr(2)
  );
}

export const formatDateMMDDYYYYHHMM = (dateString: string): string => {
  const d = new Date(dateString);
  return (
    (d.getMonth() + 1).toString() +
    '/' +
    d.getDate() +
    '/' +
    d
      .getFullYear()
      .toString()
      .substr(2) +
    ' ' +
    d.getHours() +
    ':' +
    String(d.getMinutes()).padStart(2, '0')
  );
}

// Replaced moment.js with these time helper functions
export const TimeFormat = {
  dateDaysFromNowYYYYMMDD(numberOfDays: number): string {
    //moment().subtract(14, 'd').format('YYYY-MM-DD')
    const targetDate = new Date(new Date().getTime() + (numberOfDays * 1000 * 60 * 60 * 24));
    return this.dateStringYYYYMMDD(targetDate);
  },
  dateStringYYYYMMDD(targetDate: Date): string {
    // Return the date formatted as YYYY-MM-DD
    return targetDate.getFullYear().toString() +
      '-' +
      (targetDate.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      targetDate.getDate().toString().padStart(2, '0');
  },
  dateStringYYYYMMDD_HHMMSS(targetDate: Date): string {
    // Return the date (and time) formatted as YYYY-MM-DD_HH-MM-SS
    return targetDate.getFullYear().toString() +
      '-' +
      (targetDate.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      targetDate.getDate().toString().padStart(2, '0') +
      '_' +
      targetDate.getHours().toString().padStart(2, '0') +
      '-' +
      targetDate.getMinutes().toString().padStart(2, '0') +
      '-' +
      targetDate.getSeconds().toString().padStart(2, '0');
  },
  fromNow(fromWhen: Date, now: Date): string {
    const msSinceNow = fromWhen.getTime() - now.getTime();
    if (msSinceNow < -1000 * 60 * 60 * 24) {
      // Days
      return new Intl.RelativeTimeFormat().format(Math.ceil(msSinceNow / (1000 * 60 * 60 * 24)), 'day');
    } else if (msSinceNow < -1000 * 60 * 60) {
      // Hours
      return new Intl.RelativeTimeFormat().format(Math.ceil(msSinceNow / (1000 * 60 * 60)), 'hour');
    } else if (msSinceNow < -1000 * 60) {
      // Minutes
      return new Intl.RelativeTimeFormat().format(Math.ceil(msSinceNow / (1000 * 60)), 'minute');
    } else {
      // Seconds
      return new Intl.RelativeTimeFormat().format(Math.ceil(msSinceNow / 1000), 'second');
    }
  },
}