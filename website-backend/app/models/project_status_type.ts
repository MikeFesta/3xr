// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProjectStatusTypeAttributes, ProjectStatusTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface ProjectStatusTypeInstance
  extends Model<ProjectStatusTypeAttributes, ProjectStatusTypeCreationAttributes>,
  ProjectStatusTypeAttributes {}

type ProjectStatusTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProjectStatusTypeInstance;
};

export const ProjectStatusType = sql.define(
  'project_status_type',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['id', 'name'],
      },
    },
  },
) as ProjectStatusTypeModelStatic;

export default ProjectStatusType;
