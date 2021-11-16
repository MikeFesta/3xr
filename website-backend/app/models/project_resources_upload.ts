// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProjectResourcesUploadAttributes, ProjectResourcesUploadCreationAttributes } from '@types';
import { sql } from '@root/sql';

export interface ProjectResourcesUploadInstance
  extends Model<ProjectResourcesUploadAttributes, ProjectResourcesUploadCreationAttributes>,
  ProjectResourcesUploadAttributes {}

type ProjectResourcesUploadModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProjectResourcesUploadInstance;
};

export const ProjectResourcesUpload = sql.define(
  'project_resources_upload',
  {
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
) as ProjectResourcesUploadModelStatic;

export default ProjectResourcesUpload;

import { Project } from '@models/project';

ProjectResourcesUpload.hasOne(Project, {
  as: 'project',
  foreignKey: 'id',
  sourceKey: 'projectId',
});
