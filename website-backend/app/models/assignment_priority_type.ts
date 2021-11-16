// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssignmentPriorityTypeAttributes, AssignmentPriorityTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssignmentPriorityTypeInstance
  extends Model<AssignmentPriorityTypeAttributes, AssignmentPriorityTypeCreationAttributes>,
  AssignmentPriorityTypeAttributes {}

type AssignmentPriorityTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssignmentPriorityTypeInstance;
};

export const AssignmentPriorityType = sql.define('assignment_priority_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as AssignmentPriorityTypeModelStatic;

export default AssignmentPriorityType;
