// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import RequestPromise from 'request-promise';
import { ProductReferenceImageCreationAttributes, ProductReferenceImageAttributes } from '@types';
import { sql } from '@root/sql';

import Log from '@root/log';

interface ProductReferenceImageInstance
  extends Model<ProductReferenceImageAttributes, ProductReferenceImageCreationAttributes>,
  ProductReferenceImageAttributes {
  makePrimary(): Promise<void>;
  remove(productUid: string, userId: number): Promise<void>;
}

type ProductReferenceImageModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductReferenceImageInstance;
};

export const ProductReferenceImage = sql.define(
  'product_reference_image',
  {
    filename: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    primary: Sequelize.BOOLEAN, // This isn't actually being used because sortWeight=1 is primary
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sortWeight: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fallbackImageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  /*
   * It would be nice to do this url calculation on the server, but would need to have the product uid here
  getters: (){
    url: () {
      return 'https://x.3xr.com/x/products/' + product.uid + '/reference/images/' + this.getProps('filename');
  },
   */
  {
    getterMethods: {
      filename: function (this: any) {
        const filename = this.getDataValue('filename');
        if (filename && filename.endsWith('.tif')) {
          return filename.substring(0, filename.length - 3) + 'jpg';
        }
        return filename;
      },
    },
    scopes: {
      primary: {
        where: { sort_weight: 1 }, // TODO: the primary flag is not set consistently
      },
    },
  },
) as ProductReferenceImageModelStatic;

export default ProductReferenceImage;

// Scopes
ProductReferenceImage.addScope('adminDashboard', {
  attributes: ['filename', 'id', 'sortWeight', 'primary', 'fallbackImageUrl'],
});

ProductReferenceImage.prototype.makePrimary = function () {
  return new Promise<void>((resolve, reject) => {
    return sql
      .query(
        'UPDATE product_reference_images SET "primary" = false, sort_weight = sort_weight + 1 WHERE product_id = :productId',
        { replacements: { productId: this.productId } },
      )
      .then(resetResult => {
        this.primary = true;
        this.sortWeight = 1;
        this.save()
          .then(saveResult => {
            resolve();
          })
          .catch((err: Error) => {
            Log.error('error clearing primary image for product id: ' + this.productId);
            Log.error(err);
            reject();
          });
      })
      .catch((err: Error) => {
        Log.error('error clearing primary image for product id: ' + this.productId);
        Log.error(err);
        reject();
      });
  });
};

ProductReferenceImage.prototype.remove = function (productUid: string, userId: number) {
  return new Promise<void>((resolve, reject) => {
    const sortWeight = this.sortWeight;
    if (!this.filename) {
      Log.error('Error destroying image.');
      reject();
      return;
    }
    return RequestPromise({
      method: 'POST',
      uri: 'https://x.3xr.com/messages/queue',
      form: {
        data: JSON.stringify({
          productUid: productUid,
          filename: this.filename,
        }),
        queue: 'delete_reference_image',
        userId: userId,
      },
    })
      .then(rabbitQueueResult => {
        return this.destroy()
          .then(result => {
            return sql
              .query(
                'UPDATE product_reference_images SET sort_weight = sort_weight - 1 WHERE product_id = :productId and sort_weight > :sortWeight',
                {
                  replacements: {
                    productId: this.productId,
                    sortWeight: sortWeight,
                  },
                },
              )
              .then(sortUpdate => {
                if (sortWeight == 1) {
                  // Primary image was removed, promote if any images left
                  return sql
                    .query(
                      'UPDATE product_reference_images SET "primary" = true WHERE product_id = :productId and sort_weight = 1',
                      {
                        replacements: {
                          productId: this.productId,
                          sortWeight: sortWeight,
                        },
                      },
                    )
                    .then(primarySet => {
                      resolve();
                    })
                    .catch((err: Error) => {
                      Log.error('Error setting primary image');
                      Log.error(err);
                      reject();
                    });
                } else {
                  resolve();
                }
              })
              .catch((err: Error) => {
                Log.error('Error changing sort order');
                Log.error(err);
                reject();
              });
          })
          .catch((err: Error) => {
            Log.error('Error destroying image');
            Log.error(err);
            reject();
          });
      })
      .catch((err: Error) => {
        Log.error('Error deleting reference image on disk');
        Log.error(err);
        reject();
      });
  });
};
