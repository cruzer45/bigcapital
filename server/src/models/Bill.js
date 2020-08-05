import { Model, mixin } from 'objection';
import moment from 'moment';
import { difference } from 'lodash';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';


export default class Bill extends mixin(TenantModel, [CachableModel]) {
  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['dueAmount'];
  }

  /**
   * Table name
   */
  static get tableName() {
    return 'bills';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Due amount of the given.
   * @return {number}
   */
  get dueAmount() {
    return this.amount - this.paymentAmount;
  }

  /**
   * Retrieve the not found bills ids as array.
   * @param {Array} billsIds 
   * @return {Array}
   */
  static async getNotFoundBills(billsIds) {
    const storedBills = await this.tenant().query().whereIn('id', billsIds);
    const storedBillsIds = storedBills.map((t) => t.id);

    const notFoundBillsIds = difference(
      billsIds,
      storedBillsIds,
    );
    return notFoundBillsIds;
  }
}
