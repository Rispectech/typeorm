
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class UtilService {
  private readonly numberFormat;

  constructor() {
    this.numberFormat = new Intl.NumberFormat('en-IN');
  }

  getNumberWithCommas(x) {
    return this.numberFormat.format(parseInt(x));
  }

  isObject(value): boolean {
    return _.isObject(value) && !_.isArray(value);
  }

  isArray(value): boolean {
    return _.isArray(value);
  }

  isEqual(obj1, obj2): boolean {
    return _.isEqual(obj1, obj2);
  }

  getUnixTimestamp(date) {
    return Math.floor(new Date(date).getTime());
  }
  removeFalseNullUndefinedFromArray(arr) {
    return _.compact(arr);
  }

  generateRandomCapital() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet.charAt(randomIndex);
  }
}
