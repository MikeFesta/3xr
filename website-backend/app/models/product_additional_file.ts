// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import RequestPromise from 'request-promise';
import { ProductAdditionalFileAttributes, ProductAdditionalFileCreationAttributes } from '@types';
import { sql } from '@root/sql';

import Log from '@root/log';

interface ProductAdditionalFileInstance
  extends Model<ProductAdditionalFileAttributes, ProductAdditionalFileCreationAttributes>,
  ProductAdditionalFileAttributes {
  remove(productUid: string, userId: number): Promise<void>;
}

type ProductAdditionalFileModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductAdditionalFileInstance;
};

export const ProductAdditionalFile = sql.define('product_additional_file', {
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sortWeight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as ProductAdditionalFileModelStatic;

export default ProductAdditionalFile;

ProductAdditionalFile.prototype.remove = function (productUid: string, userId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    return RequestPromise({
      method: 'POST',
      uri: 'https://x.3xr.com/messages/queue',
      form: {
        data: JSON.stringify({
          productUid: productUid,
          filename: this.filename,
        }),
        queue: 'delete_additional_file',
        userId: userId,
      },
    })
      .then((rabbitQueueResult: any) => {
        return this.destroy()
          .then(result => {
            return sql
              .query(
                'UPDATE product_additional_files SET sort_weight = sort_weight - 1 WHERE product_id = :productId and sort_weight > :sortWeight',
                {
                  replacements: {
                    productId: this.productId,
                    sortWeight: this.sortWeight,
                  },
                },
              )
              .then((sortUpdate: any) => {
                resolve();
              })
              .catch((err: Error) => {
                Log.error('Error changing sort order');
                Log.error(err);
                reject();
              });
          })
          .catch((err: Error) => {
            Log.error('Error destroying additional file');
            Log.error(err);
            reject();
          });
      })
      .catch((err: Error) => {
        Log.error('Error deleting additional file on disk');
        Log.error(err);
        reject();
      });
  });
};
