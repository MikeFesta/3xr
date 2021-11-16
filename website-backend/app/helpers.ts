// SPDX-License-Identifier: Apache-2.0
import { ProjectStatusTypesEnum, JobStatusTypeEnum } from '@enums';

class Helpers {
  public isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  public arrayItemUniquePredicate = function (value: number, index: number, self: number[]): boolean {
    return self.indexOf(value) === index;
  };

  public convertToAlphaSnakeCase(name: string): string {
    // Remove all non-alpha numeric characters (replaces spaces with _)
    return JSON.stringify(name.replace(/\s+/g, '_').toLowerCase()).replace(/\W/g, '');
  }

  public floatValueTo256Hex(value: number): string {
    const dec = Math.round(value * 255);
    return ('0' + dec.toString(16)).substr(-2);
  }

  public getRandomString(length: number): string {
    let str = '';
    while (str.length < length) {
      str += Math.random().toString(36).substring(2);
    }
    return str.substring(0, length);
  }

  public getNewUidForModel(model: any, startingLength: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const getUid = (stringLength: number) => {
        const uid = this.getRandomString(stringLength);
        model
          .findOne({ where: { uid: uid } })
          .then((result: any) => {
            if (result) {
              // Recurse until a unique id is found
              // TODO: There may be instances where the size (12) is fixed
              // TODO: Allow a prefix to be provided
              // Increase the string length to reduce changes of collision
              getUid(stringLength + 1);
              return null; // prevent bluebird warning
            } else {
              resolve(uid);
            }
          })
          .catch((err: Error) => {
            reject(err);
          });
      };
      getUid(startingLength);
    });
  }

  public inchesToMeters(inch_value: number): number {
    return inch_value * 0.0254;
  }
  public intTo256Hex(dec: number): string {
    return ('0' + dec.toString(16)).substr(-2);
  }
  public hexColorToRGB(hex: string): any {
    if (hex.charAt(0) == '#') {
      // Remove the # from the start
      hex = hex.substr(1, 6);
    }
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return {
      r: r,
      g: g,
      b: b,
    };
  }

  public parseDomain(url: string): string {
    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    // extract hostname (will be null if no match is found)
    return (matches && matches[1]) || '';
  }

  public dictionaryFilterEntries(
    flatJSONObject: { [index: string]: any },
    kvPredicate: (k: string, value: any) => boolean,
  ): any {
    const newJSONObject: { [index: string]: any } = {};
    for (const [key, value] of Object.entries(flatJSONObject)) {
      if (kvPredicate(key, value)) {
        newJSONObject[key] = value;
      }
    }
    return newJSONObject;
  }

  public filterDeletedComments = (comments: any[]) => {
    return comments
      .map((comment: any) => {
        if (comment.deleted) {
          // if comment is deleted and is also a parent comment, return the comment with change content.
          // Otherwise, filter the comment out.

          const isChildCommentEmpty = !!comment.childComment.filter((comment: any) => !comment.deleted).length;
          if (comment.childComment && comment.childComment.length && isChildCommentEmpty) {
            return {
              ...comment,
              content: 'This comment has been deleted.',
              childComment: comment.childComment.filter((comment: any) => !comment.deleted),
            };
          } else {
            return null;
          }
        } else {
          return {
            ...comment,
            childComment: comment.childComment.filter((comment: any) => !comment.deleted),
          };
        }
      })
      .filter((t: any) => t);
  };

  /*
  returns a Map containing occurences of job statuses by creating an array of status IDs,
  and reducing it to a Map<k, v>, where k is a job status, and v is a number of occurences.
  */
  public getProjectCompletionMap = (jobs: any[]): Map<JobStatusTypeEnum, number> => {
    return jobs
      .map(({ statusId }) => statusId)
      .reduce((acc, curr) => acc.set(curr, (acc.get(curr) || 0) + 1), new Map());
  };

  // calculate length of completion map without specific statuses
  public lengthOfFilteredCompletionMap = (
    status: JobStatusTypeEnum | Array<JobStatusTypeEnum>,
    completionMap: Map<JobStatusTypeEnum, number>,
  ): number => {
    return Array.from(completionMap.entries())
      .filter(entry => {
        const filteredStatuses: JobStatusTypeEnum[] = [];
        return !filteredStatuses.concat(status).includes(entry[0]);
      })
      .map(entry => entry[1])
      .reduce((prev, curr) => prev + curr, 0);
  };

  public getNewProjectStatus = (
    completionMap: Map<JobStatusTypeEnum, number>,
    currentStatusId: ProjectStatusTypesEnum,
  ): ProjectStatusTypesEnum => {
    const totalWithoutDeleteAndCancel = this.lengthOfFilteredCompletionMap(
      [JobStatusTypeEnum.COMPLETE, JobStatusTypeEnum.CANCELLED],
      completionMap,
    );
    const totalWithoutCancelled = this.lengthOfFilteredCompletionMap(JobStatusTypeEnum.CANCELLED, completionMap);

    if (completionMap.get(JobStatusTypeEnum.COMPLETE) === totalWithoutCancelled) {
      return ProjectStatusTypesEnum.COMPLETE;
    }

    if (completionMap.get(JobStatusTypeEnum.CLIENT_QA) === totalWithoutDeleteAndCancel) {
      return ProjectStatusTypesEnum.SUBMITTED_100_PERCENT;
    }
    if ((completionMap.get(JobStatusTypeEnum.CLIENT_QA) || 0) / totalWithoutDeleteAndCancel >= 0.75) {
      return ProjectStatusTypesEnum.SUBMITTED_75_PERCENT;
    }
    if ((completionMap.get(JobStatusTypeEnum.CLIENT_QA) || 0) / totalWithoutDeleteAndCancel >= 0.5) {
      return ProjectStatusTypesEnum.SUBMITTED_50_PERCENT;
    }
    if ((completionMap.get(JobStatusTypeEnum.CLIENT_QA) || 0) / totalWithoutDeleteAndCancel >= 0.25) {
      return ProjectStatusTypesEnum.SUBMITTED_25_PERCENT;
    }
    if ((completionMap.get(JobStatusTypeEnum.IN_PROGRESS) || 0) / totalWithoutDeleteAndCancel >= 0.25) {
      return ProjectStatusTypesEnum.IN_PROGRESS;
    }

    return currentStatusId;
  };

  // Progressively builds a clone of original array of objects, keeping only unique objects (by specified prop)
  public uniqueArrayByProp = <T>(list: ReadonlyArray<T>, prop: keyof T) =>
    list.reduce<ReadonlyArray<T>>(
      (acc, curr) => (acc.some(el => el[prop] === curr[prop]) ? acc : acc.concat(curr)),
      [],
    );

  public waitMs = async (ms: number) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

  public notUndefinedPredicate = <T>(el: T | undefined): el is T => {
    return el !== undefined;
  };
  public notNullPredicate = <T>(el: T | null): el is T => {
    return el !== null;
  };
}

export default new Helpers();
