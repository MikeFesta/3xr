// SPDX-License-Identifier: Apache-2.0
import Helpers from '@root/helpers';
import { JobStatusTypeEnum, ProjectStatusTypesEnum } from '@enums';

describe('Helpers', () => {
  describe('lengthOfFilteredCompletionMap', () => {
    it('should return correct length when no statuses are given', () => {
      const completionMap = new Map();
      completionMap.set(JobStatusTypeEnum.ASSIGNED, 7);
      expect(Helpers.lengthOfFilteredCompletionMap([], completionMap)).toBe(7);
    });

    it('should return correct length when one filtered status given', () => {
      const completionMap = new Map();
      completionMap.set(JobStatusTypeEnum.ASSIGNED, 7);
      completionMap.set(JobStatusTypeEnum.COMPLETE, 5);
      expect(Helpers.lengthOfFilteredCompletionMap(JobStatusTypeEnum.COMPLETE, completionMap)).toBe(7);
    });

    it('should return correct length when more than one filtered status given', () => {
      const completionMap = new Map();
      completionMap.set(JobStatusTypeEnum.ASSIGNED, 7);
      completionMap.set(JobStatusTypeEnum.COMPLETE, 5);
      completionMap.set(JobStatusTypeEnum.CANCELLED, 5);
      expect(
        Helpers.lengthOfFilteredCompletionMap([JobStatusTypeEnum.COMPLETE, JobStatusTypeEnum.CANCELLED], completionMap),
      ).toBe(7);
    });
  });

  describe('getNewProjectStatus', () => {
    describe('COMPLETE', () => {
      it('returns COMPLETE when all jobs have COMPLETE status', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.COMPLETE, 7);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.SUBMITTED_100_PERCENT)).toBe(
          ProjectStatusTypesEnum.COMPLETE,
        );
      });
      it('returns COMPLETE when all jobs have COMPLETE status, except CANCELLED jobs', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.COMPLETE, 7);
        completionMap.set(JobStatusTypeEnum.CANCELLED, 5);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.SUBMITTED_100_PERCENT)).toBe(
          ProjectStatusTypesEnum.COMPLETE,
        );
      });
    });

    describe('IN_PROGRESS', () => {
      it('returns IN_PROGRESS when 25% or more jobs have IN_PROGRESS status', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.IN_PROGRESS, 1);
        completionMap.set(JobStatusTypeEnum.ASSIGNED, 3);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.IN_PROGRESS,
        );
      });
      it('returns IN_PROGRESS when 25% or more jobs have IN_PROGRESS status, except CANCELLED jobs', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.IN_PROGRESS, 1);
        completionMap.set(JobStatusTypeEnum.ASSIGNED, 3);
        completionMap.set(JobStatusTypeEnum.CANCELLED, 7);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.IN_PROGRESS,
        );
      });
    });

    describe('SUBMITTED_25%', () => {
      it('returns SUBMITTED_25_PERCENT when 25% or more jobs have CLIENT_QA status', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.CLIENT_QA, 1);
        completionMap.set(JobStatusTypeEnum.IN_PROGRESS, 3);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.SUBMITTED_25_PERCENT,
        );
      });
      it('returns SUBMITTED_25_PERCENT when 25% or more jobs have CLIENT_QA status, except CANCELLED jobs', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.CLIENT_QA, 1);
        completionMap.set(JobStatusTypeEnum.IN_PROGRESS, 3);
        completionMap.set(JobStatusTypeEnum.CANCELLED, 7);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.SUBMITTED_25_PERCENT,
        );
      });
    });

    describe('SUBMITTED_50%', () => {
      it('returns SUBMITTED_50_PERCENT when 50% or more jobs have CLIENT_QA status', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.CLIENT_QA, 2);
        completionMap.set(JobStatusTypeEnum.IN_PROGRESS, 2);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.SUBMITTED_50_PERCENT,
        );
      });
      it('returns SUBMITTED_50_PERCENT when 50% or more jobs have CLIENT_QA status, except CANCELLED jobs', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.CLIENT_QA, 2);
        completionMap.set(JobStatusTypeEnum.IN_PROGRESS, 2);
        completionMap.set(JobStatusTypeEnum.CANCELLED, 7);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.SUBMITTED_50_PERCENT,
        );
      });
    });

    describe('SUBMITTED_75%', () => {
      it('returns SUBMITTED_75_PERCENT when 75% or more jobs have CLIENT_QA status', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.CLIENT_QA, 3);
        completionMap.set(JobStatusTypeEnum.IN_PROGRESS, 1);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.SUBMITTED_75_PERCENT,
        );
      });
      it('returns SUBMITTED_75_PERCENT when 75% or more jobs have CLIENT_QA status, except CANCELLED jobs', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.CLIENT_QA, 3);
        completionMap.set(JobStatusTypeEnum.IN_PROGRESS, 1);
        completionMap.set(JobStatusTypeEnum.CANCELLED, 7);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.SUBMITTED_75_PERCENT,
        );
      });
    });

    describe('SUBMITTED_100%', () => {
      it('returns SUBMITTED_100_PERCENT when 100% or more jobs have CLIENT_QA status', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.CLIENT_QA, 4);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.SUBMITTED_100_PERCENT,
        );
      });
      it('returns SUBMITTED_100_PERCENT when 100% or more jobs have CLIENT_QA status, except CANCELLED jobs', () => {
        const completionMap = new Map();
        completionMap.set(JobStatusTypeEnum.CLIENT_QA, 4);
        completionMap.set(JobStatusTypeEnum.CANCELLED, 7);
        expect(Helpers.getNewProjectStatus(completionMap, ProjectStatusTypesEnum.PENDING)).toBe(
          ProjectStatusTypesEnum.SUBMITTED_100_PERCENT,
        );
      });
    });
  });

  describe('filterDeletedComments', () => {
    it('should filter deleted comments', () => {
      const comments = [
        { id: 0, deleted: true, childComment: [] },
        { id: 1, deleted: false, childComment: [] },
      ];

      expect(Helpers.filterDeletedComments(comments)).toEqual([{ id: 1, deleted: false, childComment: [] }]);
    });

    it('should filter deleted comments with childComments', () => {
      const comments = [
        { id: 0, deleted: true, childComment: [] },
        { id: 1, deleted: false, childComment: [] },
        {
          id: 2,
          deleted: true,
          childComment: [
            { id: 3, deleted: true },
            { id: 4, deleted: false },
          ],
        },
        { id: 5, deleted: false, childComment: [] },
      ];

      const result = Helpers.filterDeletedComments(comments);

      expect(result).toEqual([
        { id: 1, deleted: false, childComment: [] },
        { id: 2, deleted: true, childComment: [{ id: 4, deleted: false }], content: 'This comment has been deleted.' },
        { id: 5, deleted: false, childComment: [] },
      ]);
    });

    it('should filter deleted comments when childComment has only deleted comments', () => {
      const comments = [
        { id: 0, deleted: true, childComment: [] },
        { id: 1, deleted: false, childComment: [] },
        {
          id: 2,
          deleted: true,
          childComment: [
            { id: 3, deleted: true },
            { id: 4, deleted: true },
          ],
        },
        { id: 5, deleted: false, childComment: [] },
      ];

      const result = Helpers.filterDeletedComments(comments);

      expect(result).toEqual([
        { id: 1, deleted: false, childComment: [] },
        { id: 5, deleted: false, childComment: [] },
      ]);
    });
  });
});
