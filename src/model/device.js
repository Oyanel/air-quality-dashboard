'use strict';

export default class Device {

  constructor(id, name, type, telemetry, attributes) {
    this.id = id;
    this.telemetry = telemetry;
    this.attributes = attributes;
    this.name = name;
    this.type = type;
  }
}