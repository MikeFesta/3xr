// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssignmentModelingTypeAttributes, AssignmentModelingTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssignmentModelingTypeInstance
  extends Model<AssignmentModelingTypeAttributes, AssignmentModelingTypeCreationAttributes>,
  AssignmentModelingTypeAttributes {}

type AssignmentModelingTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssignmentModelingTypeInstance;
};

export const AssignmentModelingType = sql.define('assignment_modeling_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as AssignmentModelingTypeModelStatic;

export default AssignmentModelingType;
