import log from "../utils/logger";
import Device from "../model/device";
import ThingsboardService from "../service/thingsboardService";

export default class ThingsboardController {

  /**
   *
   * @param sensorType
   * @param limit
   * @returns {Array<Device>}
   */
  static async getAllFullDevices(sensorType, limit) {
    const devices = [];
    try {
      const wsDevices = await ThingsboardService.getDevices(sensorType, limit);
      wsDevices.data.map(device => {
        devices.push(ThingsboardController.getFullDevice(device.id.id, device.name, device.type));
      });
      return Promise.all(devices).then(devices => devices);
    } catch (e) {
      log.log('error', 'Cannot fetch data from device: ' + e);
      return e;
    }
  }

  /**
   *
   * @param devices
   * @param sensorType
   * @param startDate
   * @param endDate
   * @param interval
   * @param limit
   * @returns {Array<Device>}
   */
  static async getFullDevices(devices, sensorType, keys, startDate, endDate, limit) {
    const devicesList = [];
    try {
      devices.map(device => {
        devicesList.push(
          (!_.isNil(startDate) && !_.isNil(endDate) && !_.isNil(keys) && !_.isNil(limit)) ?
            ThingsboardController.getFullDevice(device.id, device.name, device.type, keys, startDate, endDate, limit) :
            ThingsboardController.getFullDevice(device.id, device.name, device.type));
      });
      return Promise.all(devicesList).then(newDevices => newDevices);
    } catch (e) {
      log.log('error', 'Cannot fetch data from device: ' + e);
      return e;
    }
  }

  /**
   *
   * @param entityId
   * @param name
   * @param type
   * @param startDate
   * @param endDate
   * @param interval
   * @param limit
   * @returns {Device}
   */
  static async getFullDevice(entityId, name, type, keys, startDate, endDate, limit) {
    try {
      const deviceTelemetry = !_.isNil(startDate) && !_.isNil(endDate) && !_.isNil(keys) && !_.isNil(limit) ?
        ThingsboardService.getDevicesTelemetryByDate(entityId, keys, startDate, endDate, limit) :
        ThingsboardService.getDevicesTelemetry(entityId);

      if (!_.isNil(name) && !_.isNil(type))
        return deviceTelemetry.then(telemetry => new Device(entityId, name, type, telemetry));

      const device = ThingsboardController.getDevice(entityId);
      return Promise.all([deviceTelemetry, device])
        .then((devices) => new Device(entityId, devices[1].name, devices[1].type, devices[0]));

    } catch (e) {
      log.log('error', 'Cannot fetch data from device: ' + e);
      return e;
    }
  }

  /**
   * Returns the average value of a timeserie from devices.
   *
   * @param devices
   * @param timeserie
   * @returns {boolean|number}
   */
  static getAverageValueFromDevices(devices, timeserie) {
    let globalTelemetryLength = 0;

    if (_.isNil(devices) || devices.length === 0)
      return false;

    let value = 0;

    devices.map(device => {
      const deviceTimeserie = device.telemetry[timeserie];

      if (_.isNil(deviceTimeserie))
        return false;

      const avg = deviceTimeserie
        .map(item => parseFloat(item.value))
        .reduce((previous, current) => current += previous) / deviceTimeserie.length;
      value += avg;

      globalTelemetryLength++;
    });

    if (globalTelemetryLength === 0)
      return false;

    value /= devices.length;

    return parseFloat(value.toFixed(1));
  }
}