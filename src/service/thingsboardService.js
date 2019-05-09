'use strict';

import routes from './routes';
import http from './http';

export default class ThingsboardService {

  /**
   *
   * @param type
   * @param limit
   * @returns {Promise<any | never>}
   */
  static getDevices(type, limit) {
    const route = routes.TENANT_DEVICE_ROUTE
      .replace('%limit%', limit)
      .replace('%type%', type);

    return http.get(route)
      .then(res => Promise.resolve(res.data))
      .catch(err => Promise.reject(err));
  }

  /**
   *
   * @param entityId
   * @returns {Promise<any | never>}
   */
  static getDevicesTelemetry(entityId) {
    const route = routes.DEVICE_TIMESERIES
      .replace('%entityType%', 'DEVICE')
      .replace('%entityId%', entityId);

    return http.get(route)
      .then(res => Promise.resolve(res.data))
      .catch(err => Promise.reject(err));
  }

  /**
   *
   * @param entityId {String}
   * @param startDate {Timestamp}
   * @param endDate {Timestamp}
   * @param interval {String|Number}
   * @param limit {String|Number}
   * @returns {Promise<any | never>}
   */
  static getDevicesTelemetryByDate(entityId, keys, startDate, endDate, limit) {
    const route = routes.DEVICE_TIMESERIES_DATED
      .replace('%entityType%', 'DEVICE')
      .replace('%entityId%', entityId)
      .replace('%start%', startDate)
      .replace('%end%', endDate)
      .replace('%keys%', keys)
      .replace('%limit%', limit);

    return http.get(route)
      .then(res => Promise.resolve(res.data))
      .catch(err => Promise.reject(err));
  }

  /**
   *
   * @param entityId
   * @returns {Promise<any>}
   */
  static async getDeviceAttributes(entityId) {
    const route = routes.DEVICE_ATTRIBUTES
      .replace('%entityType%', 'DEVICE')
      .replace('%entityId%', entityId);

    return await http.get(route)
      .then(res => Promise.resolve(res.data))
      .catch(err => Promise.reject(err));
  }

  /**
   *
   * @param entityId
   * @returns {Promise<any>}
   */
  static async getDevice(entityId) {
    const route = routes.DEVICE_ROUTE
      .replace('%deviceId%', entityId);

    return await http.get(route)
      .then(res => Promise.resolve(res.data))
      .catch(err => Promise.reject(err));
  }

}