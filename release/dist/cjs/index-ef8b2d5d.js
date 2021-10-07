'use strict';

var LocalizationContext = require('./LocalizationContext-1fa24ffc.js');
var React = require('react');
var PropTypes = require('prop-types');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var React__namespace = /*#__PURE__*/_interopNamespace(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

/**
 * @name isDate
 * @category Common Helpers
 * @summary Is the given value a date?
 *
 * @description
 * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {*} value - the value to check
 * @returns {boolean} true if the given value is a date
 * @throws {TypeError} 1 arguments required
 *
 * @example
 * // For a valid date:
 * const result = isDate(new Date())
 * //=> true
 *
 * @example
 * // For an invalid date:
 * const result = isDate(new Date(NaN))
 * //=> true
 *
 * @example
 * // For some value:
 * const result = isDate('2014-02-31')
 * //=> false
 *
 * @example
 * // For an object:
 * const result = isDate({})
 * //=> false
 */

function isDate(value) {
  requiredArgs(1, arguments);
  return value instanceof Date || typeof value === 'object' && Object.prototype.toString.call(value) === '[object Date]';
}

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */

function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument); // Clone the date

  if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

      console.warn(new Error().stack);
    }

    return new Date(NaN);
  }
}

/**
 * @name isValid
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * - Now `isValid` doesn't throw an exception
 *   if the first argument is not an instance of Date.
 *   Instead, argument is converted beforehand using `toDate`.
 *
 *   Examples:
 *
 *   | `isValid` argument        | Before v2.0.0 | v2.0.0 onward |
 *   |---------------------------|---------------|---------------|
 *   | `new Date()`              | `true`        | `true`        |
 *   | `new Date('2016-01-01')`  | `true`        | `true`        |
 *   | `new Date('')`            | `false`       | `false`       |
 *   | `new Date(1488370835081)` | `true`        | `true`        |
 *   | `new Date(NaN)`           | `false`       | `false`       |
 *   | `'2016-01-01'`            | `TypeError`   | `false`       |
 *   | `''`                      | `TypeError`   | `false`       |
 *   | `1488370835081`           | `TypeError`   | `true`        |
 *   | `NaN`                     | `TypeError`   | `false`       |
 *
 *   We introduce this change to make *date-fns* consistent with ECMAScript behavior
 *   that try to coerce arguments to the expected type
 *   (which is also the case with other *date-fns* functions).
 *
 * @param {*} date - the date to check
 * @returns {Boolean} the date is valid
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // For the valid date:
 * const result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the value, convertable into a date:
 * const result = isValid(1393804800000)
 * //=> true
 *
 * @example
 * // For the invalid date:
 * const result = isValid(new Date(''))
 * //=> false
 */

function isValid(dirtyDate) {
  requiredArgs(1, arguments);

  if (!isDate(dirtyDate) && typeof dirtyDate !== 'number') {
    return false;
  }

  var date = toDate(dirtyDate);
  return !isNaN(Number(date));
}

var formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'less than a second',
    other: 'less than {{count}} seconds'
  },
  xSeconds: {
    one: '1 second',
    other: '{{count}} seconds'
  },
  halfAMinute: 'half a minute',
  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes'
  },
  xMinutes: {
    one: '1 minute',
    other: '{{count}} minutes'
  },
  aboutXHours: {
    one: 'about 1 hour',
    other: 'about {{count}} hours'
  },
  xHours: {
    one: '1 hour',
    other: '{{count}} hours'
  },
  xDays: {
    one: '1 day',
    other: '{{count}} days'
  },
  aboutXWeeks: {
    one: 'about 1 week',
    other: 'about {{count}} weeks'
  },
  xWeeks: {
    one: '1 week',
    other: '{{count}} weeks'
  },
  aboutXMonths: {
    one: 'about 1 month',
    other: 'about {{count}} months'
  },
  xMonths: {
    one: '1 month',
    other: '{{count}} months'
  },
  aboutXYears: {
    one: 'about 1 year',
    other: 'about {{count}} years'
  },
  xYears: {
    one: '1 year',
    other: '{{count}} years'
  },
  overXYears: {
    one: 'over 1 year',
    other: 'over {{count}} years'
  },
  almostXYears: {
    one: 'almost 1 year',
    other: 'almost {{count}} years'
  }
};

var formatDistance = function (token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];

  if (typeof tokenValue === 'string') {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace('{{count}}', count.toString());
  }

  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return 'in ' + result;
    } else {
      return result + ' ago';
    }
  }

  return result;
};

function buildFormatLongFn(args) {
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // TODO: Remove String()
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

var dateFormats = {
  full: 'EEEE, MMMM do, y',
  long: 'MMMM do, y',
  medium: 'MMM d, y',
  short: 'MM/dd/yyyy'
};
var timeFormats = {
  full: 'h:mm:ss a zzzz',
  long: 'h:mm:ss a z',
  medium: 'h:mm:ss a',
  short: 'h:mm a'
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: '{{date}}, {{time}}',
  short: '{{date}}, {{time}}'
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: 'full'
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: 'full'
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: 'full'
  })
};

var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: 'P'
};

var formatRelative = function (token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};

function buildLocalizeFn(args) {
  return function (dirtyIndex, dirtyOptions) {
    var options = dirtyOptions || {};
    var context = options.context ? String(options.context) : 'standalone';
    var valuesArray;

    if (context === 'formatting' && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;

      var _width = options.width ? String(options.width) : args.defaultWidth;

      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }

    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex; // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challange you to try to remove it!

    return valuesArray[index];
  };
}

var eraValues = {
  narrow: ['B', 'A'],
  abbreviated: ['BC', 'AD'],
  wide: ['Before Christ', 'Anno Domini']
};
var quarterValues = {
  narrow: ['1', '2', '3', '4'],
  abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
  wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
}; // Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.

var monthValues = {
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
var dayValues = {
  narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
var dayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  }
};

var ordinalNumber = function (dirtyNumber, _options) {
  var number = Number(dirtyNumber); // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`.
  //
  // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'.

  var rem100 = number % 100;

  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st';

      case 2:
        return number + 'nd';

      case 3:
        return number + 'rd';
    }
  }

  return number + 'th';
};

var localize = {
  ordinalNumber: ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: 'wide'
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: 'wide',
    argumentCallback: function (quarter) {
      return quarter - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: 'wide'
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: 'wide'
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: 'wide',
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: 'wide'
  })
};

function buildMatchFn(args) {
  return function (string) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);

    if (!matchResult) {
      return null;
    }

    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function (pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function (pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value: value,
      rest: rest
    };
  };
}

function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }

  return undefined;
}

function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }

  return undefined;
}

function buildMatchPatternFn(args) {
  return function (string) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value: value,
      rest: rest
    };
  };
}

var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function (value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseEraPatterns,
    defaultParseWidth: 'any'
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: 'any',
    valueCallback: function (index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: 'any'
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseDayPatterns,
    defaultParseWidth: 'any'
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: 'any',
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: 'any'
  })
};

/**
 * @type {Locale}
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
 * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
 */
var locale = {
  code: 'en-US',
  formatDistance: formatDistance,
  formatLong: formatLong,
  formatRelative: formatRelative,
  localize: localize,
  match: match,
  options: {
    weekStartsOn: 0
    /* Sunday */
    ,
    firstWeekContainsDate: 1
  }
};
var defaultLocale = locale;

function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }

  var number = Number(dirtyNumber);

  if (isNaN(number)) {
    return number;
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the milliseconds added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */

function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
}

/**
 * @name subMilliseconds
 * @category Millisecond Helpers
 * @summary Subtract the specified number of milliseconds from the given date.
 *
 * @description
 * Subtract the specified number of milliseconds from the given date.
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the milliseconds subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
 * const result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:29.250
 */

function subMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}

function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? '-' : '';
  var output = Math.abs(number).toString();

  while (output.length < targetLength) {
    output = '0' + output;
  }

  return sign + output;
}

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* |                                |
 * |  d  | Day of month                   |  D  |                                |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  m  | Minute                         |  M  | Month                          |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  y  | Year (abs)                     |  Y  |                                |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 */

var formatters$2 = {
  // Year
  y: function (date, token) {
    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
    // |----------|-------|----|-------|-------|-------|
    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |
    var signedYear = date.getUTCFullYear(); // Returns 1 for 1 BC (which is year 0 in JavaScript)

    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length);
  },
  // Month
  M: function (date, token) {
    var month = date.getUTCMonth();
    return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d: function (date, token) {
    return addLeadingZeros(date.getUTCDate(), token.length);
  },
  // AM or PM
  a: function (date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';

    switch (token) {
      case 'a':
      case 'aa':
        return dayPeriodEnumValue.toUpperCase();

      case 'aaa':
        return dayPeriodEnumValue;

      case 'aaaaa':
        return dayPeriodEnumValue[0];

      case 'aaaa':
      default:
        return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
    }
  },
  // Hour [1-12]
  h: function (date, token) {
    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H: function (date, token) {
    return addLeadingZeros(date.getUTCHours(), token.length);
  },
  // Minute
  m: function (date, token) {
    return addLeadingZeros(date.getUTCMinutes(), token.length);
  },
  // Second
  s: function (date, token) {
    return addLeadingZeros(date.getUTCSeconds(), token.length);
  },
  // Fraction of second
  S: function (date, token) {
    var numberOfDigits = token.length;
    var milliseconds = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};

var MILLISECONDS_IN_DAY = 86400000; // This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376

function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
}

// See issue: https://github.com/date-fns/date-fns/issues/376

function startOfUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// See issue: https://github.com/date-fns/date-fns/issues/376

function getUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// See issue: https://github.com/date-fns/date-fns/issues/376

function startOfUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getUTCISOWeekYear(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary);
  return date;
}

var MILLISECONDS_IN_WEEK$1 = 604800000; // This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376

function getUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime(); // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)

  return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
}

// See issue: https://github.com/date-fns/date-fns/issues/376

function startOfUTCWeek(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn); // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }

  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// See issue: https://github.com/date-fns/date-fns/issues/376

function getUTCWeekYear(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate, dirtyOptions);
  var year = date.getUTCFullYear();
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate); // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
  }

  var firstWeekOfNextYear = new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);
  var firstWeekOfThisYear = new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// See issue: https://github.com/date-fns/date-fns/issues/376

function startOfUTCWeekYear(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  var year = getUTCWeekYear(dirtyDate, dirtyOptions);
  var firstWeek = new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, dirtyOptions);
  return date;
}

var MILLISECONDS_IN_WEEK = 604800000; // This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376

function getUTCWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime(); // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)

  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

var dayPeriodEnum = {
  am: 'am',
  pm: 'pm',
  midnight: 'midnight',
  noon: 'noon',
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night'
};
/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |  D  | Day of year                    |
 * |  e  | Local day of week              |  E  | Day of week                    |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  | Stand-alone month              |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
 * |  p! | Long localized time            |  P! | Long localized date            |
 * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  | Local week of year             |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
 * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
 * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
 *   i.e. 7 for Sunday, 1 for Monday, etc.
 * - `I` is ISO week of year, as opposed to `w` which is local week of year.
 * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
 *   `R` is supposed to be used in conjunction with `I` and `i`
 *   for universal ISO week-numbering date, whereas
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 * - `P` is long localized date format
 * - `p` is long localized time format
 */

var formatters = {
  // Era
  G: function (date, token, localize) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;

    switch (token) {
      // AD, BC
      case 'G':
      case 'GG':
      case 'GGG':
        return localize.era(era, {
          width: 'abbreviated'
        });
      // A, B

      case 'GGGGG':
        return localize.era(era, {
          width: 'narrow'
        });
      // Anno Domini, Before Christ

      case 'GGGG':
      default:
        return localize.era(era, {
          width: 'wide'
        });
    }
  },
  // Year
  y: function (date, token, localize) {
    // Ordinal number
    if (token === 'yo') {
      var signedYear = date.getUTCFullYear(); // Returns 1 for 1 BC (which is year 0 in JavaScript)

      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize.ordinalNumber(year, {
        unit: 'year'
      });
    }

    return formatters$2.y(date, token);
  },
  // Local week-numbering year
  Y: function (date, token, localize, options) {
    var signedWeekYear = getUTCWeekYear(date, options); // Returns 1 for 1 BC (which is year 0 in JavaScript)

    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear; // Two digit year

    if (token === 'YY') {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    } // Ordinal number


    if (token === 'Yo') {
      return localize.ordinalNumber(weekYear, {
        unit: 'year'
      });
    } // Padding


    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function (date, token) {
    var isoWeekYear = getUTCISOWeekYear(date); // Padding

    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function (date, token) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function (date, token, localize) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);

    switch (token) {
      // 1, 2, 3, 4
      case 'Q':
        return String(quarter);
      // 01, 02, 03, 04

      case 'QQ':
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th

      case 'Qo':
        return localize.ordinalNumber(quarter, {
          unit: 'quarter'
        });
      // Q1, Q2, Q3, Q4

      case 'QQQ':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)

      case 'QQQQQ':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'formatting'
        });
      // 1st quarter, 2nd quarter, ...

      case 'QQQQ':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone quarter
  q: function (date, token, localize) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);

    switch (token) {
      // 1, 2, 3, 4
      case 'q':
        return String(quarter);
      // 01, 02, 03, 04

      case 'qq':
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th

      case 'qo':
        return localize.ordinalNumber(quarter, {
          unit: 'quarter'
        });
      // Q1, Q2, Q3, Q4

      case 'qqq':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)

      case 'qqqqq':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'standalone'
        });
      // 1st quarter, 2nd quarter, ...

      case 'qqqq':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // Month
  M: function (date, token, localize) {
    var month = date.getUTCMonth();

    switch (token) {
      case 'M':
      case 'MM':
        return formatters$2.M(date, token);
      // 1st, 2nd, ..., 12th

      case 'Mo':
        return localize.ordinalNumber(month + 1, {
          unit: 'month'
        });
      // Jan, Feb, ..., Dec

      case 'MMM':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // J, F, ..., D

      case 'MMMMM':
        return localize.month(month, {
          width: 'narrow',
          context: 'formatting'
        });
      // January, February, ..., December

      case 'MMMM':
      default:
        return localize.month(month, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone month
  L: function (date, token, localize) {
    var month = date.getUTCMonth();

    switch (token) {
      // 1, 2, ..., 12
      case 'L':
        return String(month + 1);
      // 01, 02, ..., 12

      case 'LL':
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th

      case 'Lo':
        return localize.ordinalNumber(month + 1, {
          unit: 'month'
        });
      // Jan, Feb, ..., Dec

      case 'LLL':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // J, F, ..., D

      case 'LLLLL':
        return localize.month(month, {
          width: 'narrow',
          context: 'standalone'
        });
      // January, February, ..., December

      case 'LLLL':
      default:
        return localize.month(month, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // Local week of year
  w: function (date, token, localize, options) {
    var week = getUTCWeek(date, options);

    if (token === 'wo') {
      return localize.ordinalNumber(week, {
        unit: 'week'
      });
    }

    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function (date, token, localize) {
    var isoWeek = getUTCISOWeek(date);

    if (token === 'Io') {
      return localize.ordinalNumber(isoWeek, {
        unit: 'week'
      });
    }

    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function (date, token, localize) {
    if (token === 'do') {
      return localize.ordinalNumber(date.getUTCDate(), {
        unit: 'date'
      });
    }

    return formatters$2.d(date, token);
  },
  // Day of year
  D: function (date, token, localize) {
    var dayOfYear = getUTCDayOfYear(date);

    if (token === 'Do') {
      return localize.ordinalNumber(dayOfYear, {
        unit: 'dayOfYear'
      });
    }

    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function (date, token, localize) {
    var dayOfWeek = date.getUTCDay();

    switch (token) {
      // Tue
      case 'E':
      case 'EE':
      case 'EEE':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T

      case 'EEEEE':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu

      case 'EEEEEE':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday

      case 'EEEE':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Local day of week
  e: function (date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;

    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case 'e':
        return String(localDayOfWeek);
      // Padded numerical value

      case 'ee':
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th

      case 'eo':
        return localize.ordinalNumber(localDayOfWeek, {
          unit: 'day'
        });

      case 'eee':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T

      case 'eeeee':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu

      case 'eeeeee':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday

      case 'eeee':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone local day of week
  c: function (date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;

    switch (token) {
      // Numerical value (same as in `e`)
      case 'c':
        return String(localDayOfWeek);
      // Padded numerical value

      case 'cc':
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th

      case 'co':
        return localize.ordinalNumber(localDayOfWeek, {
          unit: 'day'
        });

      case 'ccc':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // T

      case 'ccccc':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'standalone'
        });
      // Tu

      case 'cccccc':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'standalone'
        });
      // Tuesday

      case 'cccc':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // ISO day of week
  i: function (date, token, localize) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    switch (token) {
      // 2
      case 'i':
        return String(isoDayOfWeek);
      // 02

      case 'ii':
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd

      case 'io':
        return localize.ordinalNumber(isoDayOfWeek, {
          unit: 'day'
        });
      // Tue

      case 'iii':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T

      case 'iiiii':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu

      case 'iiiiii':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday

      case 'iiii':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // AM or PM
  a: function (date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';

    switch (token) {
      case 'a':
      case 'aa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'aaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        }).toLowerCase();

      case 'aaaaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'aaaa':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // AM, PM, midnight, noon
  b: function (date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;

    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
    }

    switch (token) {
      case 'b':
      case 'bb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'bbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        }).toLowerCase();

      case 'bbbbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'bbbb':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function (date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;

    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }

    switch (token) {
      case 'B':
      case 'BB':
      case 'BBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'BBBBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'BBBB':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Hour [1-12]
  h: function (date, token, localize) {
    if (token === 'ho') {
      var hours = date.getUTCHours() % 12;
      if (hours === 0) hours = 12;
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }

    return formatters$2.h(date, token);
  },
  // Hour [0-23]
  H: function (date, token, localize) {
    if (token === 'Ho') {
      return localize.ordinalNumber(date.getUTCHours(), {
        unit: 'hour'
      });
    }

    return formatters$2.H(date, token);
  },
  // Hour [0-11]
  K: function (date, token, localize) {
    var hours = date.getUTCHours() % 12;

    if (token === 'Ko') {
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }

    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function (date, token, localize) {
    var hours = date.getUTCHours();
    if (hours === 0) hours = 24;

    if (token === 'ko') {
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }

    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function (date, token, localize) {
    if (token === 'mo') {
      return localize.ordinalNumber(date.getUTCMinutes(), {
        unit: 'minute'
      });
    }

    return formatters$2.m(date, token);
  },
  // Second
  s: function (date, token, localize) {
    if (token === 'so') {
      return localize.ordinalNumber(date.getUTCSeconds(), {
        unit: 'second'
      });
    }

    return formatters$2.s(date, token);
  },
  // Fraction of second
  S: function (date, token) {
    return formatters$2.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function (date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    if (timezoneOffset === 0) {
      return 'Z';
    }

    switch (token) {
      // Hours and optional minutes
      case 'X':
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`

      case 'XXXX':
      case 'XX':
        // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`

      case 'XXXXX':
      case 'XXX': // Hours and minutes with `:` delimiter

      default:
        return formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function (date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      // Hours and optional minutes
      case 'x':
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`

      case 'xxxx':
      case 'xx':
        // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`

      case 'xxxxx':
      case 'xxx': // Hours and minutes with `:` delimiter

      default:
        return formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (GMT)
  O: function (date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      // Short
      case 'O':
      case 'OO':
      case 'OOO':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
      // Long

      case 'OOOO':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (specific non-location)
  z: function (date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      // Short
      case 'z':
      case 'zz':
      case 'zzz':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
      // Long

      case 'zzzz':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':');
    }
  },
  // Seconds timestamp
  t: function (date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1000);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function (date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};

function formatTimezoneShort(offset, dirtyDelimiter) {
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;

  if (minutes === 0) {
    return sign + String(hours);
  }

  var delimiter = dirtyDelimiter || '';
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}

function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
  if (offset % 60 === 0) {
    var sign = offset > 0 ? '-' : '+';
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }

  return formatTimezone(offset, dirtyDelimiter);
}

function formatTimezone(offset, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

var formatters$1 = formatters;

function dateLongFormatter(pattern, formatLong) {
  switch (pattern) {
    case 'P':
      return formatLong.date({
        width: 'short'
      });

    case 'PP':
      return formatLong.date({
        width: 'medium'
      });

    case 'PPP':
      return formatLong.date({
        width: 'long'
      });

    case 'PPPP':
    default:
      return formatLong.date({
        width: 'full'
      });
  }
}

function timeLongFormatter(pattern, formatLong) {
  switch (pattern) {
    case 'p':
      return formatLong.time({
        width: 'short'
      });

    case 'pp':
      return formatLong.time({
        width: 'medium'
      });

    case 'ppp':
      return formatLong.time({
        width: 'long'
      });

    case 'pppp':
    default:
      return formatLong.time({
        width: 'full'
      });
  }
}

function dateTimeLongFormatter(pattern, formatLong) {
  var matchResult = pattern.match(/(P+)(p+)?/);
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];

  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong);
  }

  var dateTimeFormat;

  switch (datePattern) {
    case 'P':
      dateTimeFormat = formatLong.dateTime({
        width: 'short'
      });
      break;

    case 'PP':
      dateTimeFormat = formatLong.dateTime({
        width: 'medium'
      });
      break;

    case 'PPP':
      dateTimeFormat = formatLong.dateTime({
        width: 'long'
      });
      break;

    case 'PPPP':
    default:
      dateTimeFormat = formatLong.dateTime({
        width: 'full'
      });
      break;
  }

  return dateTimeFormat.replace('{{date}}', dateLongFormatter(datePattern, formatLong)).replace('{{time}}', timeLongFormatter(timePattern, formatLong));
}

var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
var longFormatters$1 = longFormatters;

/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

var protectedDayOfYearTokens = ['D', 'DD'];
var protectedWeekYearTokens = ['YY', 'YYYY'];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format, input) {
  if (token === 'YYYY') {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === 'YY') {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === 'D') {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === 'DD') {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  }
}

// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps

var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g; // This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`

var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
/**
 * @name format
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. The result may vary by locale.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://git.io/fxCyr
 *
 * The characters wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 * (see the last example)
 *
 * Format of the string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 7 below the table).
 *
 * Accepted patterns:
 * | Unit                            | Pattern | Result examples                   | Notes |
 * |---------------------------------|---------|-----------------------------------|-------|
 * | Era                             | G..GGG  | AD, BC                            |       |
 * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 | GGGGG   | A, B                              |       |
 * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
 * |                                 | yy      | 44, 01, 00, 17                    | 5     |
 * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
 * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
 * |                                 | yyyyy   | ...                               | 3,5   |
 * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
 * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
 * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
 * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
 * |                                 | YYYYY   | ...                               | 3,5   |
 * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
 * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
 * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
 * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
 * |                                 | RRRRR   | ...                               | 3,5,7 |
 * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
 * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
 * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
 * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
 * |                                 | uuuuu   | ...                               | 3,5   |
 * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
 * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | QQ      | 01, 02, 03, 04                    |       |
 * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
 * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | qq      | 01, 02, 03, 04                    |       |
 * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
 * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
 * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | MM      | 01, 02, ..., 12                   |       |
 * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 | MMMM    | January, February, ..., December  | 2     |
 * |                                 | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
 * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | LL      | 01, 02, ..., 12                   |       |
 * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 | LLLL    | January, February, ..., December  | 2     |
 * |                                 | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | w       | 1, 2, ..., 53                     |       |
 * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
 * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | II      | 01, 02, ..., 53                   | 7     |
 * | Day of month                    | d       | 1, 2, ..., 31                     |       |
 * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
 * |                                 | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
 * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
 * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
 * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 | DDDD    | ...                               | 3     |
 * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
 * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
 * |                                 | ii      | 01, 02, ..., 07                   | 7     |
 * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
 * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
 * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
 * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
 * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | ee      | 02, 03, ..., 01                   |       |
 * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | cc      | 02, 03, ..., 01                   |       |
 * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | AM, PM                          | a..aa   | AM, PM                            |       |
 * |                                 | aaa     | am, pm                            |       |
 * |                                 | aaaa    | a.m., p.m.                        | 2     |
 * |                                 | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
 * |                                 | bbb     | am, pm, noon, midnight            |       |
 * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
 * |                                 | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
 * |                                 | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
 * |                                 | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
 * |                                 | KK      | 01, 02, ..., 11, 00               |       |
 * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
 * |                                 | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          | m       | 0, 1, ..., 59                     |       |
 * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | mm      | 00, 01, ..., 59                   |       |
 * | Second                          | s       | 0, 1, ..., 59                     |       |
 * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | ss      | 00, 01, ..., 59                   |       |
 * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
 * |                                 | SS      | 00, 01, ..., 99                   |       |
 * |                                 | SSS     | 000, 001, ..., 999                |       |
 * |                                 | SSSS    | ...                               | 3     |
 * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
 * |                                 | XX      | -0800, +0530, Z                   |       |
 * |                                 | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
 * |                                 | xx      | -0800, +0530, +0000               |       |
 * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
 * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
 * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
 * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
 * | Seconds timestamp               | t       | 512969520                         | 7     |
 * |                                 | tt      | ...                               | 3,7   |
 * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
 * |                                 | TT      | ...                               | 3,7   |
 * | Long localized date             | P       | 04/29/1453                        | 7     |
 * |                                 | PP      | Apr 29, 1453                      | 7     |
 * |                                 | PPP     | April 29th, 1453                  | 7     |
 * |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
 * | Long localized time             | p       | 12:00 AM                          | 7     |
 * |                                 | pp      | 12:00:00 AM                       | 7     |
 * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
 * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
 * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
 * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
 * |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
 * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
 *    the output will be the same as default pattern for this unit, usually
 *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
 *    are marked with "2" in the last column of the table.
 *
 *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
 *
 * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
 *    The output will be padded with zeros to match the length of the pattern.
 *
 *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
 *
 * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 5. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` always returns the last two digits of a year,
 *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
 *
 *    | Year | `yy` | `uu` |
 *    |------|------|------|
 *    | 1    |   01 |   01 |
 *    | 14   |   14 |   14 |
 *    | 376  |   76 |  376 |
 *    | 1453 |   53 | 1453 |
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
 *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
 *
 * 6. Specific non-location timezones are currently unavailable in `date-fns`,
 *    so right now these tokens fall back to GMT timezones.
 *
 * 7. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `t`: seconds timestamp
 *    - `T`: milliseconds timestamp
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://git.io/fxCyr
 *
 * 9. `D` and `DD` tokens represent days of the year but they are ofthen confused with days of the month.
 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://git.io/fxCyr
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * - The second argument is now required for the sake of explicitness.
 *
 *   ```javascript
 *   // Before v2.0.0
 *   format(new Date(2016, 0, 1))
 *
 *   // v2.0.0 onward
 *   format(new Date(2016, 0, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
 *   ```
 *
 * - New format string API for `format` function
 *   which is based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table).
 *   See [this post](https://blog.date-fns.org/post/unicode-tokens-in-date-fns-v2-sreatyki91jg) for more details.
 *
 * - Characters are now escaped using single quote symbols (`'`) instead of square brackets.
 *
 * @param {Date|Number} date - the original date
 * @param {String} format - the string of tokens
 * @param {Object} [options] - an object with options.
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
 * @param {Boolean} [options.useAdditionalWeekYearTokens=false] - if true, allows usage of the week-numbering year tokens `YY` and `YYYY`;
 *   see: https://git.io/fxCyr
 * @param {Boolean} [options.useAdditionalDayOfYearTokens=false] - if true, allows usage of the day of year tokens `D` and `DD`;
 *   see: https://git.io/fxCyr
 * @returns {String} the formatted date string
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `date` must not be Invalid Date
 * @throws {RangeError} `options.locale` must contain `localize` property
 * @throws {RangeError} `options.locale` must contain `formatLong` property
 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
 * @throws {RangeError} use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://git.io/fxCyr
 * @throws {RangeError} use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://git.io/fxCyr
 * @throws {RangeError} use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://git.io/fxCyr
 * @throws {RangeError} use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://git.io/fxCyr
 * @throws {RangeError} format string contains an unescaped latin alphabet character
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * var result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * import { eoLocale } from 'date-fns/locale/eo'
 * var result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
 *   locale: eoLocale
 * })
 * //=> '2-a de julio 2014'
 *
 * @example
 * // Escape string by single quote characters:
 * var result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
 * //=> "3 o'clock"
 */

function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
  requiredArgs(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var options = dirtyOptions || {};
  var locale = options.locale || defaultLocale;
  var localeFirstWeekContainsDate = locale.options && locale.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate); // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
  }

  var localeWeekStartsOn = locale.options && locale.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn); // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }

  if (!locale.localize) {
    throw new RangeError('locale must contain localize property');
  }

  if (!locale.formatLong) {
    throw new RangeError('locale must contain formatLong property');
  }

  var originalDate = toDate(dirtyDate);

  if (!isValid(originalDate)) {
    throw new RangeError('Invalid time value');
  } // Convert the date in system timezone to the same date in UTC+00:00 timezone.
  // This ensures that when UTC functions will be implemented, locales will be compatible with them.
  // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376


  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate: firstWeekContainsDate,
    weekStartsOn: weekStartsOn,
    locale: locale,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp).map(function (substring) {
    var firstCharacter = substring[0];

    if (firstCharacter === 'p' || firstCharacter === 'P') {
      var longFormatter = longFormatters$1[firstCharacter];
      return longFormatter(substring, locale.formatLong, formatterOptions);
    }

    return substring;
  }).join('').match(formattingTokensRegExp).map(function (substring) {
    // Replace two single quote characters with one single quote character
    if (substring === "''") {
      return "'";
    }

    var firstCharacter = substring[0];

    if (firstCharacter === "'") {
      return cleanEscapedString(substring);
    }

    var formatter = formatters$1[firstCharacter];

    if (formatter) {
      if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, dirtyDate);
      }

      if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, dirtyDate);
      }

      return formatter(utcDate, substring, locale.localize, formatterOptions);
    }

    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
    }

    return substring;
  }).join('');
  return result;
}

function cleanEscapedString(input) {
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}

/*
  ImageRenderer displays image with url or source
  it checks if the source exist with img tag first
  if it exists onLoad is called, if not onError is called
  and those properties switch img tag to real purposing element
*/
// TODO: Set up the official constant of width and height with DesignTeam

function ImageRenderer(_ref) {
  var className = _ref.className,
      url = _ref.url,
      alt = _ref.alt,
      width = _ref.width,
      height = _ref.height,
      defaultComponent = _ref.defaultComponent,
      circle = _ref.circle,
      placeHolder = _ref.placeHolder;

  var _useState = React.useState(false),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      showDefaultComponent = _useState2[0],
      setShowDefaultComponent = _useState2[1];

  var _useState3 = React.useState(true),
      _useState4 = LocalizationContext._slicedToArray(_useState3, 2),
      showPlaceHolder = _useState4[0],
      setShowPlaceHolder = _useState4[1];

  var DefaultComponent = React.useMemo(function () {
    if (typeof defaultComponent === 'function') {
      return defaultComponent();
    }

    return defaultComponent;
  }, [defaultComponent]);
  var PlaceHolder = React.useMemo(function () {
    if (placeHolder && typeof placeHolder === 'function') {
      return placeHolder({
        style: {
          width: '100%',
          minWidth: width,
          maxWidth: '400px',
          height: height,
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      });
    }

    return null;
  }, [placeHolder]);
  var HiddenImageLoader = React.useMemo(function () {
    setShowDefaultComponent(false); // reset the state when url is changed

    return /*#__PURE__*/React__default["default"].createElement("img", {
      className: "sendbird-image-renderer__hidden-image-loader",
      src: url,
      alt: alt,
      onLoad: function onLoad() {
        return setShowPlaceHolder(false);
      },
      onError: function onError() {
        return setShowDefaultComponent(true);
      }
    });
  }, [url]);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-image-renderer']).join(' '),
    style: {
      width: '100%',
      minWidth: width,
      maxWidth: '400px',
      height: height
    }
  }, showPlaceHolder && PlaceHolder, showDefaultComponent ? DefaultComponent : /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-image-renderer__image",
    style: {
      width: '100%',
      minWidth: width,
      maxWidth: '400px',
      height: height,
      position: 'absolute',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundImage: "url(".concat(url, ")"),
      borderRadius: circle ? '50%' : null
    }
  }), HiddenImageLoader);
}
ImageRenderer.propTypes = {
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].arrayOf(PropTypes__default["default"].string), PropTypes__default["default"].string]),
  url: PropTypes__default["default"].string.isRequired,
  alt: PropTypes__default["default"].string,
  width: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  height: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  defaultComponent: PropTypes__default["default"].oneOfType([PropTypes__default["default"].element, PropTypes__default["default"].func]),
  placeHolder: PropTypes__default["default"].func,
  circle: PropTypes__default["default"].bool
};
ImageRenderer.defaultProps = {
  className: '',
  defaultComponent: null,
  placeHolder: null,
  alt: '',
  width: null,
  height: null,
  circle: false
};

var Type = {
  ADD: 'ADD',
  ARROW_LEFT: 'ARROW_LEFT',
  ATTACH: 'ATTACH',
  BAN: 'BAN',
  BROADCAST: 'BROADCAST',
  CAMERA: 'CAMERA',
  CHANNELS: 'CHANNELS',
  CHAT: 'CHAT',
  CHAT_FILLED: 'CHAT_FILLED',
  CHEVRON_DOWN: 'CHEVRON_DOWN',
  CHEVRON_RIGHT: 'CHEVRON_RIGHT',
  CLOSE: 'CLOSE',
  COLLAPSE: 'COLLAPSE',
  COPY: 'COPY',
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  DISCONNECTED: 'DISCONNECTED',
  DOCUMENT: 'DOCUMENT',
  DONE: 'DONE',
  DONE_ALL: 'DONE_ALL',
  DOWNLOAD: 'DOWNLOAD',
  EDIT: 'EDIT',
  EMOJI_MORE: 'EMOJI_MORE',
  ERROR: 'ERROR',
  EXPAND: 'EXPAND',
  FILE_AUDIO: 'FILE_AUDIO',
  FILE_DOCUMENT: 'FILE_DOCUMENT',
  FREEZE: 'FREEZE',
  GIF: 'GIF',
  INFO: 'INFO',
  LEAVE: 'LEAVE',
  MEMBERS: 'MEMBERS',
  MESSAGE: 'MESSAGE',
  MODERATIONS: 'MODERATIONS',
  MORE: 'MORE',
  MUTE: 'MUTE',
  NOTIFICATIONS: 'NOTIFICATIONS',
  NOTIFICATIONS_OFF_FILLED: 'NOTIFICATIONS_OFF_FILLED',
  OPERATOR: 'OPERATOR',
  PHOTO: 'PHOTO',
  PLAY: 'PLAY',
  PLUS: 'PLUS',
  QUESTION: 'QUESTION',
  REFRESH: 'REFRESH',
  REPLY: 'REPLY',
  REMOVE: 'REMOVE',
  SEARCH: 'SEARCH',
  SEND: 'SEND',
  SETTINGS_FILLED: 'SETTINGS_FILLED',
  SPINNER: 'SPINNER',
  SUPERGROUP: 'SUPERGROUP',
  THUMBNAIL_NONE: 'THUMBNAIL_NONE',
  TOGGLE_OFF: 'TOGGLE_OFF',
  TOGGLE_ON: 'TOGGLE_ON',
  USER: 'USER'
};

var _path$Q;

function _extends$S() { _extends$S = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$S.apply(this, arguments); }

function SvgIconAdd(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$S({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$Q || (_path$Q = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-add_svg__fill",
    d: "M50.667 5.333a8 8 0 018 8v37.334a8 8 0 01-8 8H13.333a8 8 0 01-8-8V13.333a8 8 0 018-8zm0 5.334H13.333a2.667 2.667 0 00-2.666 2.666v37.334a2.667 2.667 0 002.666 2.666h37.334a2.667 2.667 0 002.666-2.666V13.333a2.667 2.667 0 00-2.666-2.666zm-18.667 8a2.667 2.667 0 012.649 2.355l.018.311v8h8a2.667 2.667 0 01.311 5.316l-.311.018h-8v8a2.667 2.667 0 01-5.316.311l-.018-.311v-8h-8a2.667 2.667 0 01-.311-5.316l.311-.018h8v-8A2.667 2.667 0 0132 18.667z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$P;

function _extends$R() { _extends$R = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$R.apply(this, arguments); }

function SvgIconArrowLeft(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$R({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$P || (_path$P = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-arrow-left_svg__fill",
    d: "M33.886 8.781a2.668 2.668 0 01.221 3.52l-.221.251-16.78 16.781H56a2.667 2.667 0 01.311 5.316l-.311.018-38.895-.001 16.78 16.782a2.666 2.666 0 01.222 3.52l-.221.251a2.668 2.668 0 01-3.52.222l-.252-.222L8.781 33.886a2.668 2.668 0 01-.222-3.52l.222-.252L30.114 8.781a2.668 2.668 0 013.772 0z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$O;

function _extends$Q() { _extends$Q = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$Q.apply(this, arguments); }

function SvgIconAttach(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$Q({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$O || (_path$O = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-attach_svg__fill",
    d: "M55.334 28.926l-24.506 23.34c-5.222 4.973-13.74 4.973-18.962 0-5.149-4.903-5.149-12.797 0-17.7l24.506-23.34c3.138-2.988 8.278-2.988 11.416 0 3.064 2.919 3.064 7.594 0 10.513L23.255 45.077c-1.055 1.005-2.815 1.005-3.87.001-.98-.933-.98-2.39 0-3.325l22.64-21.535a2.667 2.667 0 00-3.676-3.864L15.709 37.89a7.578 7.578 0 00-.001 11.05c3.113 2.966 8.11 2.966 11.224 0l24.533-23.338c5.272-5.021 5.272-13.217 0-18.238-5.197-4.95-13.573-4.95-18.77 0L8.187 30.704c-7.356 7.005-7.356 18.419 0 25.424 7.281 6.935 19.036 6.935 26.318 0l24.506-23.34a2.666 2.666 0 10-3.678-3.862z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$N;

function _extends$P() { _extends$P = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$P.apply(this, arguments); }

function SvgIconBan(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$P({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$N || (_path$N = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-ban_svg__fill",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333 2.667 48.2 2.667 32 15.8 2.667 32 2.667zM32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm12.333 21.333a1 1 0 011 1v3.334a1 1 0 01-1 1H19.667a1 1 0 01-1-1v-3.334a1 1 0 011-1h24.666z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$M;

function _extends$O() { _extends$O = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$O.apply(this, arguments); }

function SvgIconBroadcast(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$O({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$M || (_path$M = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-broadcast_svg__fill",
    d: "M58.545 5.498c.08.258.122.526.122.796v46.079a2.666 2.666 0 01-3.462 2.546l-17.951-5.61c-.645 5.273-5.14 9.358-10.587 9.358C20.776 58.667 16 53.89 16 48v-5.334h-5.333a8 8 0 01-7.997-7.75l-.003-.25V24a8 8 0 018-8H16L55.205 3.749a2.665 2.665 0 013.34 1.75zM21.333 44.587V48a5.333 5.333 0 0010.652.398L32 47.92l-10.667-3.333zm32-34.667l-32 9.997v18.83l32 9.997V9.92zM16 21.333h-5.333a2.67 2.67 0 00-2.65 2.356L8 24v10.667a2.667 2.667 0 002.667 2.666H16v-16z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$L;

function _extends$N() { _extends$N = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$N.apply(this, arguments); }

function SvgIconCamera(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$N({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$L || (_path$L = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-camera_svg__fill",
    d: "M40 5.333c.892 0 1.724.446 2.219 1.188l4.541 6.812H56a8 8 0 017.986 7.53l.014.47v29.334a8 8 0 01-8 8H8a8 8 0 01-8-8V21.333a8 8 0 018-8h9.237l4.544-6.812a2.665 2.665 0 011.888-1.167l.331-.02zm-1.43 5.334H25.428l-4.542 6.812a2.66 2.66 0 01-1.887 1.167l-.331.02H8a2.668 2.668 0 00-2.667 2.667v29.334A2.667 2.667 0 008 53.333h48a2.667 2.667 0 002.667-2.666V21.333A2.667 2.667 0 0056 18.667H45.333a2.665 2.665 0 01-2.218-1.188l-4.544-6.812zM32 21.333c7.364 0 13.333 5.97 13.333 13.334C45.333 42.03 39.363 48 32 48c-7.364 0-13.333-5.97-13.333-13.333 0-7.364 5.97-13.334 13.333-13.334zm0 5.334a8 8 0 100 16 8 8 0 000-16z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$K;

function _extends$M() { _extends$M = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$M.apply(this, arguments); }

function SvgIconChannels(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$M({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$K || (_path$K = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-channels_svg__fill",
    d: "M42.65 5.333l.311.017a2.666 2.666 0 012.373 2.633l-.017.311-1.45 13.04h9.466a2.667 2.667 0 01.311 5.315l-.31.018H43.271l-1.184 10.666h11.245a2.667 2.667 0 01.312 5.316l-.31.018H41.495l-1.512 13.627a2.667 2.667 0 01-5.318-.277l.017-.311 1.448-13.04H25.496l-1.512 13.628a2.667 2.667 0 01-5.318-.277l.017-.311 1.448-13.04h-9.464a2.667 2.667 0 01-.311-5.315l.31-.018h10.057l1.186-10.667H10.667a2.667 2.667 0 01-.311-5.315l.31-.018h11.835l1.515-13.627a2.668 2.668 0 012.634-2.373l.311.017a2.666 2.666 0 012.373 2.633l-.017.311-1.45 13.04H38.5l1.515-13.628a2.668 2.668 0 012.634-2.373zm-5.927 32l1.186-10.667H27.272l-1.184 10.667h10.635z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$J;

function _extends$L() { _extends$L = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$L.apply(this, arguments); }

function SvgIconChat(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$L({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$J || (_path$J = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-chat_svg__fill",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333c-4.455 0-8.679-.993-12.461-2.77l-1.753.58c-5.965 1.912-10.133 2.572-12.504 1.981-2.799-.698-3.351-1.919-1.657-3.663 1.171-1.396 2.147-3.14 2.928-5.234.622-1.668.377-4.001-.737-7A29.15 29.15 0 012.666 32C2.667 15.8 15.8 2.667 32 2.667zM32 8C18.745 8 8 18.745 8 32c0 3.5.747 6.88 2.168 9.978l.405.837.137.271.106.285c1.517 4.085 1.89 7.622.734 10.72l-.382.972-.192.433.235-.05a62.067 62.067 0 004.886-1.363l1.721-.568 2.04-.696 1.95.917A23.882 23.882 0 0032 56c13.255 0 24-10.745 24-24S45.255 8 32 8z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$I;

function _extends$K() { _extends$K = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$K.apply(this, arguments); }

function SvgIconChatFilled(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$K({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$I || (_path$I = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-chat-filled_svg__fill",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333c-4.455 0-8.679-.993-12.461-2.77l-1.753.58c-5.965 1.912-10.133 2.572-12.504 1.981-2.799-.698-3.351-1.919-1.657-3.663 1.171-1.396 2.147-3.14 2.928-5.234.622-1.668.377-4.001-.737-7A29.15 29.15 0 012.666 32C2.667 15.8 15.8 2.667 32 2.667z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$H;

function _extends$J() { _extends$J = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$J.apply(this, arguments); }

function SvgIconChevronDown(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$J({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$H || (_path$H = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-chevron-down_svg__fill",
    d: "M16.121 21.879a2.998 2.998 0 00-4.242 0 2.998 2.998 0 000 4.242l18 18a2.998 2.998 0 004.242 0l18-18a2.998 2.998 0 000-4.242 2.998 2.998 0 00-4.242 0L32 37.757 16.121 21.88z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$G;

function _extends$I() { _extends$I = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$I.apply(this, arguments); }

function SvgIconChevronRight(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$I({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$G || (_path$G = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-chevron-right_svg__fill",
    d: "M22.114 46.114a2.668 2.668 0 003.772 3.772l16-16a2.668 2.668 0 000-3.772l-16-16a2.668 2.668 0 00-3.772 3.772L36.23 32 22.114 46.114z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$F;

function _extends$H() { _extends$H = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$H.apply(this, arguments); }

function SvgIconClose(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$H({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$F || (_path$F = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-close_svg__fill",
    d: "M52.552 11.448a2.666 2.666 0 01.222 3.52l-.222.251-16.781 16.78 16.781 16.782a2.665 2.665 0 010 3.771 2.666 2.666 0 01-3.52.222l-.251-.222L32 35.771 15.219 52.552a2.665 2.665 0 01-3.771 0 2.666 2.666 0 01-.222-3.52l.222-.251L28.228 32l-16.78-16.781a2.665 2.665 0 010-3.771 2.666 2.666 0 013.52-.222l.251.222 16.78 16.78 16.782-16.78a2.665 2.665 0 013.771 0z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$E;

function _extends$G() { _extends$G = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$G.apply(this, arguments); }

function SvgIconCollapse(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$G({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$E || (_path$E = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-collapse_svg__fill",
    d: "M16 8a2.667 2.667 0 00-2.649 2.356l-.018.31v42.667a2.667 2.667 0 005.316.311l.018-.31V34.666h25.56l-6.113 6.114a2.668 2.668 0 00-.221 3.52l.221.251a2.666 2.666 0 003.52.222l.252-.222 10.666-10.666a2.666 2.666 0 00.222-3.52l-.222-.252-10.666-10.666a2.666 2.666 0 00-3.993 3.52l.221.251 6.113 6.114h-25.56V10.667A2.667 2.667 0 0016 8z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$D;

function _extends$F() { _extends$F = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$F.apply(this, arguments); }

function SvgIconCopy(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$F({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$D || (_path$D = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-copy_svg__fill",
    d: "M53.333 21.333a8 8 0 018 8v24a8 8 0 01-8 8h-24a8 8 0 01-8-8v-24a8 8 0 018-8zm0 5.334h-24a2.667 2.667 0 00-2.666 2.666v24A2.667 2.667 0 0029.333 56h24A2.667 2.667 0 0056 53.333v-24a2.667 2.667 0 00-2.667-2.666zm-18.666-24a8 8 0 017.986 7.53l.014.47v2.666a2.667 2.667 0 01-5.316.311l-.018-.31v-2.667a2.67 2.67 0 00-2.355-2.65L34.667 8h-24a2.67 2.67 0 00-2.65 2.356l-.017.31v24a2.67 2.67 0 002.356 2.65l.31.017h2.667a2.667 2.667 0 01.311 5.316l-.31.018h-2.667a8.001 8.001 0 01-7.987-7.53l-.013-.47v-24c0-4.26 3.33-7.743 7.53-7.987l.47-.013h24z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$C;

function _extends$E() { _extends$E = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$E.apply(this, arguments); }

function SvgIconCreate(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$E({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$C || (_path$C = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-create_svg__fill",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333c-4.455 0-8.679-.993-12.461-2.77l-1.753.58c-5.965 1.912-10.133 2.572-12.504 1.981-2.799-.698-3.351-1.919-1.657-3.663 1.171-1.396 2.147-3.14 2.928-5.234.622-1.668.377-4.001-.737-7A29.15 29.15 0 012.666 32C2.667 15.8 15.8 2.667 32 2.667zM32 8C18.745 8 8 18.745 8 32c0 3.5.747 6.88 2.168 9.978l.405.837.137.271.106.285c1.517 4.085 1.89 7.622.734 10.72l-.382.972-.192.433.235-.05a62.067 62.067 0 004.886-1.363l1.721-.568 2.04-.696 1.95.917A23.882 23.882 0 0032 56c13.255 0 24-10.745 24-24S45.255 8 32 8zm2.667 16v5.333H40c3.556 0 3.556 5.334 0 5.334h-5.333V40c0 3.556-5.334 3.556-5.334 0v-5.333H24c-3.556 0-3.556-5.334 0-5.334h5.333V24c0-3.556 5.334-3.556 5.334 0z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$B;

function _extends$D() { _extends$D = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$D.apply(this, arguments); }

function SvgIconDelete(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$D({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$B || (_path$B = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-delete_svg__fill",
    d: "M37.333 2.667c4.26 0 7.743 3.33 7.987 7.53l.013.47v2.666H56a2.667 2.667 0 01.311 5.316l-.311.018h-2.668l.001 34.666c0 4.26-3.33 7.743-7.53 7.987l-.47.013H18.667a8.001 8.001 0 01-7.987-7.53l-.013-.47V18.667H8a2.667 2.667 0 01-.311-5.316L8 13.333h10.666v-2.666a8.002 8.002 0 017.53-7.987l.47-.013h10.667zm10.666 16H16v34.666a2.67 2.67 0 002.356 2.65l.31.017h26.667a2.67 2.67 0 002.65-2.356l.017-.31V18.666zm-21.332 8a2.667 2.667 0 012.648 2.355l.018.311v16a2.667 2.667 0 01-5.316.311l-.017-.31v-16a2.667 2.667 0 012.667-2.667zm10.666 0a2.67 2.67 0 012.65 2.355l.017.311v16a2.667 2.667 0 01-5.315.311l-.018-.31v-16a2.667 2.667 0 012.666-2.667zm0-18.667H26.667a2.67 2.67 0 00-2.65 2.356l-.017.31v2.667h16v-2.666a2.67 2.67 0 00-2.356-2.65L37.334 8z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$A;

function _extends$C() { _extends$C = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$C.apply(this, arguments); }

function SvgIconDisconnected(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$C({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$A || (_path$A = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-disconnected_svg__fill",
    d: "M54.534 6.069l-.248.217-9.736 9.735-.04.04-9.573 9.573c-.15.118-.286.254-.405.404L6.286 54.286a2.423 2.423 0 003.18 3.645l.248-.217 13.374-13.373a2.419 2.419 0 001.88-.401 12.119 12.119 0 0114.04 0 2.424 2.424 0 102.808-3.952 16.951 16.951 0 00-11.303-3.072l6.743-6.744a24.105 24.105 0 0110.159 5.021 2.424 2.424 0 003.11-3.719 28.945 28.945 0 00-9.34-5.23l5.633-5.634a36.153 36.153 0 019.225 5.934 2.425 2.425 0 003.211-3.633 40.972 40.972 0 00-8.796-5.941l7.256-7.256a2.423 2.423 0 00-3.18-3.645zm-35.04 21.474a28.936 28.936 0 00-6.032 3.942 2.424 2.424 0 003.137 3.697 24.018 24.018 0 015.022-3.282 2.425 2.425 0 00-2.127-4.357zM4.748 22.909a2.424 2.424 0 003.207 3.636 36.363 36.363 0 0126.978-8.977 2.424 2.424 0 00.389-4.832A41.204 41.204 0 004.748 22.909z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$z;

function _extends$B() { _extends$B = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$B.apply(this, arguments); }

function SvgIconDocument(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$B({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$z || (_path$z = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-document_svg__fill",
    d: "M37.333 2.667a3.305 3.305 0 01.274.014l.085.01.058.008c.047.007.094.016.141.026l.029.007c.05.01.098.023.146.037l.034.01c.237.07.46.173.663.303l.034.022c.036.023.07.047.104.072l.057.043a2.646 2.646 0 01.261.228l-.126-.117c.05.043.097.088.143.135L55.21 19.438c.047.046.091.094.134.143l.035.04c.026.032.052.063.076.096l.04.054.07.1.024.038c.16.253.279.535.347.836l.01.048c.009.043.017.086.024.13l.006.048.007.051.004.041c.01.09.014.18.014.27v32a8 8 0 01-8 8H16a8 8 0 01-8-8V10.667a8 8 0 018-8h21.333zM34.666 8H16a2.667 2.667 0 00-2.667 2.667v42.666A2.667 2.667 0 0016 56h32a2.667 2.667 0 002.667-2.667L50.666 24H37.333a2.667 2.667 0 01-2.648-2.356l-.018-.31L34.666 8zm12.227 10.667l-6.894-6.894.001 6.894h6.893z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$y;

function _extends$A() { _extends$A = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$A.apply(this, arguments); }

function SvgIconDone(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$A({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$y || (_path$y = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-done_svg__fill",
    d: "M12.552 31.448a2.665 2.665 0 10-3.771 3.771l13.333 13.333a2.666 2.666 0 003.772 0L55.219 19.22a2.667 2.667 0 00-3.771-3.771L24 42.895 12.552 31.448z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$x;

function _extends$z() { _extends$z = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$z.apply(this, arguments); }

function SvgIconDoneAll(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$z({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$x || (_path$x = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-done-all_svg__fill",
    d: "M5.886 31.448L19.219 44.78a2.667 2.667 0 01-3.771 3.771L2.114 35.22a2.667 2.667 0 013.772-3.771zm52.228-16a2.666 2.666 0 113.772 3.771L32.552 48.552a2.665 2.665 0 01-3.771 0L15.448 35.22a2.665 2.665 0 010-3.771 2.665 2.665 0 013.771 0l11.448 11.447zm-9.562 0a2.665 2.665 0 010 3.771L32.556 35.215a2.665 2.665 0 01-3.771 0 2.664 2.664 0 010-3.77L44.78 15.447a2.665 2.665 0 013.771 0z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$w;

function _extends$y() { _extends$y = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$y.apply(this, arguments); }

function SvgIconDownload(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$y({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$w || (_path$w = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-download_svg__fill",
    d: "M56 42.667a2.667 2.667 0 012.649 2.355l.018.311v8c0 4.26-3.33 7.743-7.53 7.987l-.47.013H13.333a8 8 0 01-7.986-7.53l-.014-.47v-8a2.667 2.667 0 015.316-.311l.018.311v8a2.67 2.67 0 002.355 2.65l.311.017h37.334a2.667 2.667 0 002.648-2.356l.018-.31v-8A2.667 2.667 0 0156 42.667zm-36.552-8.781a2.666 2.666 0 013.52-3.993l.251.221 6.114 6.114V5.333a2.667 2.667 0 015.316-.311l.018.311v30.894l6.114-6.113a2.668 2.668 0 013.52-.221l.251.221a2.666 2.666 0 01.222 3.52l-.222.252-10.658 10.657a2.341 2.341 0 01-.135.128l.127-.119a2.67 2.67 0 01-.195.176l-.056.045a1.74 1.74 0 01-.086.064l-.056.04-.086.056-.06.036-.081.046-.079.04a2.528 2.528 0 01-.14.065l-.09.036c-.023.01-.045.017-.067.025l-.09.03-.063.019c-.043.012-.086.024-.13.034l-.013.003a3.06 3.06 0 01-.144.028l-.064.01c-.03.005-.061.009-.092.012l-.084.008a1.727 1.727 0 01-.103.006l-.069.002h-.095c-.028 0-.055-.002-.082-.003l.139.003c-.084 0-.167-.004-.249-.011l-.061-.007a1.359 1.359 0 01-.092-.012l-.09-.015a2.242 2.242 0 01-.118-.025l-.04-.01a2.644 2.644 0 01-.34-.11l-.015-.006c-.05-.02-.097-.04-.145-.063l-.042-.02L30.71 45a1.16 1.16 0 01-.067-.039c-.03-.018-.059-.035-.087-.054l-.062-.041c-.03-.02-.06-.042-.088-.063l-.04-.03-.008-.007a2.796 2.796 0 01-.251-.223L19.448 33.886z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$v;

function _extends$x() { _extends$x = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$x.apply(this, arguments); }

function SvgIconEdit(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$x({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 65 65"
  }, props), _path$v || (_path$v = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-edit_svg__fill",
    d: "M56 56a2.667 2.667 0 01.311 5.315l-.311.018H8a2.667 2.667 0 01-.311-5.316L8 56h48zM35.448 3.448a2.665 2.665 0 013.771 0l10.667 10.666a2.668 2.668 0 010 3.772L20.552 47.219c-.5.5-1.178.781-1.885.781H8a2.667 2.667 0 01-2.667-2.667V34.667c0-.708.281-1.386.781-1.886zm1.885 5.659L10.667 35.77v6.896h6.89L44.227 16l-6.894-6.893z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$u;

function _extends$w() { _extends$w = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$w.apply(this, arguments); }

function SvgIconEmojiMore(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$w({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$u || (_path$u = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-emoji-more_svg__fill",
    d: "M32.097 3.22c2.65 0 5.255.357 7.763 1.054a2.134 2.134 0 01-1.144 4.111 24.669 24.669 0 00-6.619-.899c-13.603 0-24.63 11.027-24.63 24.63s11.027 24.63 24.63 24.63 24.63-11.027 24.63-24.63c0-2.227-.295-4.413-.87-6.518a2.13 2.13 0 011.494-2.62 2.13 2.13 0 012.62 1.494 28.895 28.895 0 011.023 7.644c0 15.96-12.938 28.897-28.897 28.897-15.96 0-28.897-12.937-28.897-28.897C3.2 16.157 16.138 3.22 32.097 3.22zm10.705 34.792a2.133 2.133 0 012.024 2.808c-1.873 5.623-6.937 9.488-12.729 9.488-5.792 0-10.856-3.865-12.73-9.488a2.134 2.134 0 011.875-2.803l.15-.005h21.41zm-3.477 4.266H24.867l.294.382c1.539 1.887 3.718 3.113 6.115 3.342l.314.024.507.015c2.617 0 5.037-1.188 6.743-3.151l.193-.23.292-.382zM21.392 21.954c1.087 0 1.985.814 2.116 1.866l.017.267v5.353a2.133 2.133 0 01-4.25.268l-.017-.268v-5.353c0-1.178.955-2.133 2.134-2.133zm21.41 0c1.088 0 1.985.814 2.117 1.866l.017.267v5.353a2.133 2.133 0 01-4.25.268l-.017-.268v-5.353c0-1.178.955-2.133 2.133-2.133zM54.853 0a.8.8 0 01.8.8v7.786h7.76a.8.8 0 01.8.8v2.667a.8.8 0 01-.8.8h-7.76v7.758a.8.8 0 01-.8.8h-2.666a.8.8 0 01-.8-.8v-7.758h-7.785a.8.8 0 01-.8-.8V9.387a.8.8 0 01.8-.8l7.784-.001V.8a.8.8 0 01.8-.8h2.667z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$t;

function _extends$v() { _extends$v = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$v.apply(this, arguments); }

function SvgIconError(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$v({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$t || (_path$t = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-error_svg__fill",
    d: "M32 5.06a8 8 0 016.561 3.424l.287.439 22.608 37.744a8 8 0 01.022 7.962 8.005 8.005 0 01-6.356 4.014l-.535.024H9.384a8.002 8.002 0 01-6.862-4.038 8.008 8.008 0 01-.226-7.493l.27-.506L25.16 8.91A8.001 8.001 0 0132 5.06zm0 5.333c-.816 0-1.58.372-2.076.99l-.196.28-22.565 37.67a2.669 2.669 0 001.909 3.973l.341.027h45.144a2.67 2.67 0 002.45-3.659l-.148-.304L34.28 11.676A2.666 2.666 0 0032 10.393zm0 32.274A2.667 2.667 0 1132 48a2.667 2.667 0 010-5.333zm0-21.334a2.667 2.667 0 012.649 2.356l.018.311v10.667a2.667 2.667 0 01-5.316.311l-.018-.311V24A2.667 2.667 0 0132 21.333z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$s;

function _extends$u() { _extends$u = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$u.apply(this, arguments); }

function SvgIconExpand(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$u({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$s || (_path$s = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-expand_svg__fill",
    d: "M48 8a2.667 2.667 0 012.649 2.356l.018.31V32l-.001.027v21.306a2.667 2.667 0 01-5.315.311l-.018-.31V34.665H19.772l6.114 6.115a2.668 2.668 0 01.221 3.52l-.221.251a2.666 2.666 0 01-3.52.222l-.252-.222-10.666-10.666a2.666 2.666 0 01-.222-3.52l.222-.252 10.666-10.666a2.666 2.666 0 013.993 3.52l-.221.251-6.113 6.114h25.56V10.667A2.667 2.667 0 0148 8z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$r;

function _extends$t() { _extends$t = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$t.apply(this, arguments); }

function SvgIconFileAudio(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$t({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$r || (_path$r = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-file-audio_svg__fill",
    d: "M30.52 12.51c1.685-1.226 4.139-.103 4.139 1.893v35.194c0 1.996-2.454 3.119-4.138 1.893l-12.45-9.909H7.898c-1.416 0-2.564-1.074-2.564-2.399V24.818c0-1.325 1.148-2.4 2.564-2.4h10.175zm20.427.163c10.293 10.667 10.293 27.987 0 38.654a2.137 2.137 0 01-3.156-.047c-.86-.942-.84-2.448.044-3.364 8.49-8.799 8.49-23.033 0-31.832-.884-.916-.904-2.422-.044-3.364a2.137 2.137 0 013.156-.047zm-8.492 8.799c5.597 5.8 5.597 15.231 0 21.031a2.136 2.136 0 01-3.156-.046c-.86-.942-.84-2.448.044-3.364 3.794-3.932 3.794-10.279 0-14.211-.884-.916-.904-2.422-.044-3.363a2.136 2.136 0 013.156-.047z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$q;

function _extends$s() { _extends$s = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$s.apply(this, arguments); }

function SvgIconFileDocument(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$s({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$q || (_path$q = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-file-document_svg__fill",
    d: "M39.414 6.4a2.41 2.41 0 011.71.701l12.642 12.75c.407.41.634.953.634 1.516v29.765c0 3.542-4.342 6.468-8 6.468H16.16c-3.658 0-6.4-2.926-6.4-6.468L9.6 12.868c0-3.542 2.902-6.468 6.56-6.468zm3.331 35.173l-21.49.027-.147.005c-1.066.08-1.908 1.014-1.908 2.155 0 1.193.92 2.16 2.055 2.16l21.49-.027.147-.005c1.066-.08 1.908-1.014 1.908-2.155 0-1.193-.92-2.16-2.055-2.16zm0-8.533l-21.49.027-.147.005c-1.066.08-1.908 1.014-1.908 2.155 0 1.193.92 2.16 2.055 2.16l21.49-.027.147-.005c1.066-.08 1.908-1.014 1.908-2.155 0-1.193-.92-2.16-2.055-2.16zm-11.807-8.507h-9.6l-.153.006a2.15 2.15 0 00-1.985 2.154c0 1.193.957 2.16 2.138 2.16h9.6l.152-.005a2.152 2.152 0 001.985-2.155c0-1.193-.957-2.16-2.137-2.16z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$p;

function _extends$r() { _extends$r = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$r.apply(this, arguments); }

function SvgIconFreeze(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$r({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$p || (_path$p = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-freeze_svg__fill",
    d: "M41.636 3.226l.251.222a2.668 2.668 0 01.222 3.52l-.222.251-7.219 7.218V27.38l11.209-6.472 2.643-9.86a2.667 2.667 0 015.218 1.051l-.067.329-2.237 8.35 8.352 2.24a2.668 2.668 0 011.952 2.938l-.067.328a2.667 2.667 0 01-2.937 1.952l-.329-.066-9.861-2.643L37.334 32l11.209 6.47 9.862-2.64.329-.067a2.667 2.667 0 012.937 1.952l.067.328a2.669 2.669 0 01-1.952 2.938l-8.353 2.237 2.238 8.353.067.329a2.666 2.666 0 01-5.218 1.052l-2.643-9.861-11.209-6.472v12.944l7.219 7.218a2.667 2.667 0 01-3.52 3.993l-.251-.222L32 54.437l-6.114 6.115a2.666 2.666 0 01-3.52.222l-.251-.222a2.666 2.666 0 01-.222-3.52l.222-.251 7.218-7.22V36.62l-11.209 6.47-2.642 9.863a2.666 2.666 0 01-5.218-1.052l.067-.329 2.236-8.351-8.35-2.24a2.665 2.665 0 01-1.953-2.937l.067-.328a2.665 2.665 0 012.937-1.952l.329.066 9.861 2.642L26.667 32l-11.209-6.472-9.86 2.643-.329.066a2.665 2.665 0 01-2.937-1.952l-.067-.328a2.668 2.668 0 011.952-2.938l8.35-2.239-2.235-8.351-.067-.329a2.667 2.667 0 015.218-1.052l2.642 9.862 11.209 6.47V14.439L22.116 7.22a2.665 2.665 0 010-3.771 2.666 2.666 0 013.52-.222l.251.222 6.114 6.112 6.115-6.112a2.666 2.666 0 013.52-.222z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$o;

function _extends$q() { _extends$q = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$q.apply(this, arguments); }

function SvgIconGif(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$q({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$o || (_path$o = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-gif_svg__fill",
    d: "M16.664 45.333c2.155 0 4.119-.318 5.89-.953 1.772-.636 3.143-1.53 4.113-2.683V31.34h-10.29v3.94h4.902v4.474c-.861.856-2.304 1.283-4.327 1.283-2.011 0-3.538-.695-4.58-2.085-1.04-1.39-1.562-3.446-1.562-6.168v-1.657c.012-2.698.497-4.73 1.455-6.097.958-1.366 2.352-2.05 4.184-2.05 1.437 0 2.565.345 3.385 1.034.82.69 1.35 1.777 1.59 3.262h5.243c-.324-2.804-1.36-4.94-3.107-6.408-1.748-1.468-4.172-2.201-7.273-2.201-2.226 0-4.169.502-5.827 1.506-1.658 1.004-2.927 2.454-3.807 4.35-.88 1.895-1.32 4.138-1.32 6.728v1.765c.024 2.52.5 4.712 1.428 6.578.928 1.865 2.245 3.288 3.95 4.269 1.707.98 3.69 1.47 5.953 1.47zm20.67 0V18.667H32v26.666h5.333zm10.396 0V34.436h9.721v-4.432H47.73v-6.887h10.937v-4.45h-16v26.666h5.063z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$n;

function _extends$p() { _extends$p = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$p.apply(this, arguments); }

function SvgIconInfo(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$p({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$n || (_path$n = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-info_svg__fill",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333 2.667 48.2 2.667 32 15.8 2.667 32 2.667zM32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm1.667 21.333a1 1 0 011 1v14a1 1 0 01-1 1h-3.334a1 1 0 01-1-1v-14a1 1 0 011-1h3.334zm-1.667-8a2.667 2.667 0 110 5.334 2.667 2.667 0 010-5.334z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$m;

function _extends$o() { _extends$o = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$o.apply(this, arguments); }

function SvgIconLeave(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$o({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$m || (_path$m = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-leave_svg__fill",
    d: "M32 5.333a2.667 2.667 0 01.311 5.316l-.311.018H10.667a2.67 2.67 0 00-2.65 2.355L8 13.333v37.334a2.667 2.667 0 002.356 2.648l.31.018H32a2.667 2.667 0 01.311 5.316l-.311.018H10.667a8.001 8.001 0 01-7.987-7.53l-.013-.47V13.333a8 8 0 017.53-7.986l.47-.014H32zm17.634 13.893l.252.222 10.666 10.666a2.666 2.666 0 01.222 3.52l-.222.252-10.666 10.666a2.666 2.666 0 01-3.993-3.52l.221-.251 4.78-4.782L20 36a2.667 2.667 0 01-.311-5.315l.311-.018h33.56l-7.446-7.448a2.668 2.668 0 01-.221-3.52l.221-.251a2.666 2.666 0 013.52-.222z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$l;

function _extends$n() { _extends$n = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$n.apply(this, arguments); }

function SvgIconMembers(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$n({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$l || (_path$l = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-members_svg__fill",
    d: "M34.667 37.333c7.17 0 13.018 5.66 13.32 12.755l.013.579V56a2.667 2.667 0 01-5.315.311L42.667 56v-5.333c0-4.26-3.33-7.743-7.53-7.987l-.47-.013H13.333a8 8 0 00-7.986 7.53l-.014.47V56a2.667 2.667 0 01-5.316.311L0 56v-5.333c0-7.17 5.66-13.019 12.755-13.321l.578-.013h21.334zM54 37.765a13.333 13.333 0 019.986 12.297l.014.605V56a2.667 2.667 0 01-5.315.311L58.667 56v-5.331a8 8 0 00-6-7.74A2.667 2.667 0 1154 37.765zM24 5.333c7.364 0 13.333 5.97 13.333 13.334C37.333 26.03 31.363 32 24 32c-7.364 0-13.333-5.97-13.333-13.333 0-7.364 5.97-13.334 13.333-13.334zm19.328.43a13.333 13.333 0 010 25.834 2.667 2.667 0 11-1.323-5.167 8 8 0 000-15.5 2.667 2.667 0 111.323-5.167zM24 10.667a8 8 0 100 16 8 8 0 000-16z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$k;

function _extends$m() { _extends$m = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$m.apply(this, arguments); }

function SvgIconMessage(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$m({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$k || (_path$k = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-message_svg__fill",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333c-4.455 0-8.679-.993-12.461-2.77l-1.753.58c-5.965 1.912-10.133 2.572-12.504 1.981-2.799-.698-3.351-1.919-1.657-3.663 1.171-1.396 2.147-3.14 2.928-5.234.622-1.668.377-4.001-.737-7A29.15 29.15 0 012.666 32C2.667 15.8 15.8 2.667 32 2.667zM32 8C18.745 8 8 18.745 8 32c0 3.5.747 6.88 2.168 9.978l.405.837.137.271.106.285c1.517 4.085 1.89 7.622.734 10.72l-.382.972-.192.433.235-.05a62.067 62.067 0 004.886-1.363l1.721-.568 2.04-.696 1.95.917A23.882 23.882 0 0032 56c13.255 0 24-10.745 24-24S45.255 8 32 8zM18.667 29.333a2.667 2.667 0 11-.001 5.333 2.667 2.667 0 01.001-5.333zm13.333 0a2.667 2.667 0 110 5.334 2.667 2.667 0 010-5.334zm13.333 0a2.667 2.667 0 110 5.334 2.667 2.667 0 010-5.334z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$j;

function _extends$l() { _extends$l = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$l.apply(this, arguments); }

function SvgIconModerations(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$l({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$j || (_path$j = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-moderations_svg__fill",
    d: "M18.667 34.667a2.667 2.667 0 01.311 5.316l-.311.017h-5.334v16a2.667 2.667 0 01-5.316.311L8 56V40H2.667a2.667 2.667 0 01-.311-5.315l.31-.018h16zM32 29.333a2.667 2.667 0 012.649 2.356l.018.311v24a2.667 2.667 0 01-5.316.311L29.333 56V32A2.667 2.667 0 0132 29.333zM61.333 40a2.667 2.667 0 01.311 5.315l-.31.018h-5.335L56 56a2.667 2.667 0 01-5.315.311L50.667 56l-.001-10.668-5.333.001a2.667 2.667 0 01-.311-5.316l.311-.017h16zm-8-34.667a2.67 2.67 0 012.65 2.356L56 8v24a2.667 2.667 0 01-5.315.311L50.667 32V8a2.667 2.667 0 012.666-2.667zm-42.666 0a2.667 2.667 0 012.648 2.356l.018.311v18.667a2.667 2.667 0 01-5.316.311L8 26.667V8a2.667 2.667 0 012.667-2.667zm21.333 0a2.667 2.667 0 012.649 2.356l.018.311-.001 10.666H40a2.668 2.668 0 01.311 5.317L40 24H24a2.667 2.667 0 01-.311-5.315l.311-.018h5.333V8A2.667 2.667 0 0132 5.333z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$i;

function _extends$k() { _extends$k = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$k.apply(this, arguments); }

function SvgIconMore(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$k({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$i || (_path$i = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-more_svg__fill",
    d: "M32 45.333a5.333 5.333 0 110 10.666 5.333 5.333 0 010-10.666zM32 28a5.333 5.333 0 110 10.668A5.333 5.333 0 0132 28zm0-17.333c2.946 0 5.333 2.387 5.333 5.333S34.946 21.333 32 21.333 26.667 18.946 26.667 16s2.387-5.333 5.333-5.333z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$h;

function _extends$j() { _extends$j = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$j.apply(this, arguments); }

function SvgIconMute(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$j({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$h || (_path$h = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-mute_svg__fill",
    d: "M55.62 19.616l.067.123A26.552 26.552 0 0158.667 32c0 4.326-1.03 8.41-2.864 12.025-1.012 2.726-1.235 4.847-.67 6.363.71 1.903 1.598 3.49 2.662 4.758 1.54 1.586 1.039 2.696-1.506 3.33-2.09.521-5.716-.027-10.879-1.646l-.488-.155-1.594-.527A26.56 26.56 0 0132 58.667a26.55 26.55 0 01-12.326-3.014l-.059-.03 4-4A21.24 21.24 0 0032 53.333c2.993 0 5.89-.614 8.562-1.786l.498-.226 1.925-.905 3.613 1.196.695.219c.728.225 1.414.423 2.054.595l.472.125.485.121-.167-.42-.2-.594c-.814-2.685-.484-5.681.713-9.065l.154-.425.106-.284.528-1.084a21.188 21.188 0 001.895-8.8 21.24 21.24 0 00-1.71-8.385l3.997-3.999zm2.266-13.502a2.668 2.668 0 01.221 3.52l-.221.252-48 48a2.668 2.668 0 01-3.993-3.52l.221-.252 5.238-5.237a26.563 26.563 0 01-6.015-16.412L5.333 32C5.333 17.272 17.273 5.333 32 5.333a26.55 26.55 0 0116.877 6.02l5.237-5.239a2.668 2.668 0 013.772 0zM32 10.667c-11.782 0-21.333 9.55-21.333 21.333 0 4.836 1.614 9.401 4.48 13.084l29.936-29.938A21.248 21.248 0 0032 10.666z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$g;

function _extends$i() { _extends$i = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$i.apply(this, arguments); }

function SvgIconNotifications(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$i({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$g || (_path$g = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-notifications_svg__fill",
    d: "M36.613 53.333c2.056 0 3.338 2.227 2.307 4.005a8 8 0 01-13.84 0c-.98-1.689.129-3.783 2.004-3.988l.303-.017h9.226zM32 2.667c11.56 0 20.972 9.194 21.323 20.669l.01.664v13.333a5.334 5.334 0 004.936 5.319l.753.033c2.963.318 3.077 4.616.342 5.24l-.342.056-.355.019H5.333l-.355-.019c-3.082-.33-3.082-4.965 0-5.296l.753-.033a5.335 5.335 0 004.92-4.9l.016-.419V24c0-11.782 9.55-21.333 21.333-21.333zM32 8c-8.636 0-15.674 6.842-15.989 15.4L16 24v13.333c0 1.562-.336 3.046-.939 4.383l-.275.564-.218.387h34.861l-.215-.387a10.583 10.583 0 01-1.146-3.74l-.055-.674-.013-.533V24c0-8.837-7.163-16-16-16z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$f;

function _extends$h() { _extends$h = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$h.apply(this, arguments); }

function SvgIconNotificationsOffFilled(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$h({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$f || (_path$f = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-notifications-off-filled_svg__fill",
    d: "M36.613 53.333c2.056 0 3.338 2.227 2.307 4.005a8 8 0 01-13.84 0c-.98-1.689.129-3.783 2.004-3.988l.303-.017h9.226zM32 2.667c7.173 0 13.52 3.54 17.387 8.97l5.686-5.687a2.105 2.105 0 012.85-.117l.127.117a2.105 2.105 0 010 2.977L8.927 58.05c-.78.781-2.023.82-2.85.117l-.127-.117a2.105 2.105 0 010-2.977L13.023 48h-7.69l-.355-.019c-3.082-.33-3.082-4.965 0-5.296l.753-.033a5.335 5.335 0 004.92-4.9l.016-.419V24c0-11.782 9.55-21.333 21.333-21.333zm20.85 16.795c.271 1.253.433 2.548.473 3.874l.01.664v13.333a5.334 5.334 0 004.936 5.319l.753.033c2.963.318 3.077 4.616.342 5.24l-.342.056-.355.019H24.31l28.54-28.538z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$e;

function _extends$g() { _extends$g = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$g.apply(this, arguments); }

function SvgIconOperator(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$g({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$e || (_path$e = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-operator_svg__fill",
    d: "M29.83 6.45a2.667 2.667 0 014.34 0l11.697 16.374L57 13.918c1.88-1.504 4.573.054 4.32 2.35l-.047.29-8 37.334A2.666 2.666 0 0150.666 56H13.333a2.666 2.666 0 01-2.607-2.108l-8-37.333c-.525-2.452 2.315-4.207 4.273-2.641l11.132 8.906zM32 12.587l-11.163 15.63a2.667 2.667 0 01-3.836.532l-7.497-5.997 5.984 27.915h33.021l5.984-27.915L47 28.749a2.667 2.667 0 01-3.632-.281l-.204-.251L32 12.587zM32 32a5.333 5.333 0 110 10.668A5.333 5.333 0 0132 32z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$d;

function _extends$f() { _extends$f = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$f.apply(this, arguments); }

function SvgIconPhoto(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$f({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$d || (_path$d = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-photo_svg__fill",
    d: "M50.667 5.333a8 8 0 018 8v37.334a8 8 0 01-8 8H13.333a8 8 0 01-8-8V13.333a8 8 0 018-8zm-8 25.107L19.77 53.332l30.896.001a2.667 2.667 0 002.661-2.498l.005-.168v-9.564L42.666 30.44zm8-19.773H13.333a2.667 2.667 0 00-2.666 2.666v37.334c0 1.143.72 2.119 1.731 2.498L40.781 24.78a2.668 2.668 0 013.52-.222l.251.222 8.78 8.78.001-20.228a2.667 2.667 0 00-2.498-2.661l-.168-.005zm-28 5.333a6.666 6.666 0 110 13.333 6.666 6.666 0 010-13.333zm0 5.333a1.334 1.334 0 100 2.667 1.334 1.334 0 000-2.667z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$c;

function _extends$e() { _extends$e = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$e.apply(this, arguments); }

function SvgIconPlay(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$e({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$c || (_path$c = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-play_svg__fill",
    d: "M51.908 34.75c1.9-1.233 1.896-3.26.013-4.514L19.376 8.577c-1.893-1.26-3.404-.391-3.376 1.968l.522 42.888c.028 2.347 1.596 3.247 3.493 2.016L51.908 34.75z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$b;

function _extends$d() { _extends$d = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$d.apply(this, arguments); }

function SvgIconPlus(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$d({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$b || (_path$b = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-plus_svg__fill",
    d: "M34.667 29.333h18.666c3.556 0 3.556 5.334 0 5.334H34.667v18.666c0 3.556-5.334 3.556-5.334 0V34.667H10.667c-3.556 0-3.556-5.334 0-5.334h18.666V10.667c0-3.556 5.334-3.556 5.334 0v18.666z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$a;

function _extends$c() { _extends$c = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$c.apply(this, arguments); }

function SvgIconQuestion(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$c({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$a || (_path$a = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-question_svg__fill",
    d: "M32 61.333C15.8 61.333 2.667 48.2 2.667 32S15.8 2.667 32 2.667 61.333 15.8 61.333 32 48.2 61.333 32 61.333zM32 56c13.255 0 24-10.745 24-24S45.255 8 32 8 8 18.745 8 32s10.745 24 24 24zm2.213-18.63a2.667 2.667 0 11-5.333 0v-2.69c0-1.148.734-2.168 1.823-2.53.173-.058.532-.195 1.01-.407.809-.36 1.616-.79 2.354-1.282 1.835-1.223 2.813-2.528 2.813-3.786a5.333 5.333 0 00-10.364-1.777 2.667 2.667 0 01-5.032-1.77 10.668 10.668 0 0120.729 3.551c0 3.413-2.022 6.109-5.187 8.22a21.268 21.268 0 01-2.813 1.578v.893zm-5.333 7.523a2.667 2.667 0 115.333 0v.44a2.667 2.667 0 11-5.333 0v-.44z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$9;

function _extends$b() { _extends$b = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$b.apply(this, arguments); }

function SvgIconRefresh(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$b({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$9 || (_path$9 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-refresh_svg__fill",
    d: "M46.14 14.43l.562.537 6.631 6.167v-7.8a2.67 2.67 0 012.356-2.65l.311-.017a2.667 2.667 0 012.649 2.355l.018.311v16a2.67 2.67 0 01-2.356 2.65L56 32H40a2.667 2.667 0 01-.311-5.315l.311-.018h11.452l-8.44-7.85c-5.964-5.893-15.168-7.182-22.563-3.156-7.38 4.018-11.172 12.357-9.314 20.455 1.859 8.107 8.935 14.032 17.362 14.518 8.43.487 16.162-4.585 18.967-12.426a2.667 2.667 0 015.022 1.797C48.88 50.082 38.973 56.582 28.19 55.959c-10.785-.623-19.862-8.222-22.254-18.65C3.542 26.872 8.426 16.135 17.9 10.977c9.227-5.024 20.65-3.579 28.241 3.453z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$8;

function _extends$a() { _extends$a = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$a.apply(this, arguments); }

function SvgIconRemove(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$a({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$8 || (_path$8 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-remove_svg__fill",
    d: "M32 2.667C48.2 2.667 61.333 15.8 61.333 32S48.2 61.333 32 61.333 2.667 48.2 2.667 32 15.8 2.667 32 2.667zm9.886 19.447a2.668 2.668 0 00-3.772 0L32 28.23l-6.114-6.115-.134-.124a2.667 2.667 0 00-3.638.124l-.124.134a2.667 2.667 0 00.124 3.638L28.23 32l-6.115 6.114-.124.134a2.667 2.667 0 00.124 3.638l.134.124a2.667 2.667 0 003.638-.124L32 35.77l6.114 6.115.134.124a2.667 2.667 0 003.638-.124l.124-.134a2.667 2.667 0 00-.124-3.638L35.77 32l6.115-6.114.124-.134a2.667 2.667 0 00-.124-3.638z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$7;

function _extends$9() { _extends$9 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }

function SvgIconReplyFilled(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$9({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 12 12"
  }, props), _path$7 || (_path$7 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-reply-filled_svg__fill",
    d: "M11.774 10.5c.062 0 .12-.025.164-.07a.22.22 0 00.062-.164c-.07-1.447-.495-2.678-1.268-3.66-.618-.785-1.455-1.409-2.49-1.855a9.331 9.331 0 00-2.406-.655 9.542 9.542 0 00-.862-.078V2.225a.225.225 0 00-.128-.203.23.23 0 00-.24.028L.084 5.692A.221.221 0 000 5.865c0 .068.03.132.082.175l4.523 3.737c.067.056.16.068.24.03a.222.222 0 00.13-.202v-1.95c1.134-.08 2.178.003 3.107.25a6.39 6.39 0 012.087.96c1.018.724 1.398 1.5 1.4 1.507a.23.23 0 00.205.128z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$6;

function _extends$8() { _extends$8 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }

function SvgIconSearch(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$8({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$6 || (_path$6 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-search_svg__fill",
    d: "M26.667 48C14.885 48 5.333 38.449 5.333 26.667c0-11.782 9.552-21.334 21.334-21.334S48 14.885 48 26.667c0 4.93-1.672 9.469-4.48 13.081l13.67 13.67a2.668 2.668 0 01-3.772 3.772l-13.67-13.67A21.239 21.239 0 0126.667 48zm0-5.333c8.836 0 16-7.164 16-16 0-8.837-7.164-16-16-16-8.837 0-16 7.163-16 16 0 8.836 7.163 16 16 16z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$5;

function _extends$7() { _extends$7 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }

function SvgIconSend(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$7({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$5 || (_path$5 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-send_svg__fill",
    d: "M59.795 29.43L7.329 2.979C4.691 1.802 1.76 4.153 2.932 6.798l6.925 18.609a2 2 0 001.544 1.275l32.273 5.394L11.4 37.47a1.998 1.998 0 00-1.544 1.275L2.932 57.353c-.879 2.645 1.76 4.997 4.397 3.527l52.466-26.453c2.051-.882 2.051-3.82 0-4.996z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$4;

function _extends$6() { _extends$6 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }

function SvgIconSettingsFilled(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$6({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$4 || (_path$4 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-settings-filled_svg__fill",
    d: "M32 2.667A5.332 5.332 0 0137.333 8v.24A4.4 4.4 0 0040 12.267a4.4 4.4 0 004.853-.88l.16-.16a5.332 5.332 0 017.547 0 5.333 5.333 0 010 7.546l-.16.16a4.401 4.401 0 00-.88 4.854V24a4.4 4.4 0 004.027 2.667H56c2.946 0 5.333 2.387 5.333 5.333S58.946 37.333 56 37.333h-.24A4.4 4.4 0 0051.733 40a4.4 4.4 0 00.88 4.853l.16.16a5.332 5.332 0 010 7.547 5.333 5.333 0 01-7.546 0l-.16-.16a4.401 4.401 0 00-4.854-.88 4.397 4.397 0 00-2.666 4.027V56a5.333 5.333 0 01-10.667 0v-.24A4.4 4.4 0 0024 51.733a4.4 4.4 0 00-4.853.88l-.16.16a5.332 5.332 0 01-7.547 0 5.333 5.333 0 010-7.546l.16-.16a4.401 4.401 0 00.88-4.854 4.397 4.397 0 00-4.027-2.666H8A5.333 5.333 0 018 26.88h.24A4.4 4.4 0 0012.267 24a4.4 4.4 0 00-.88-4.853l-.16-.16a5.332 5.332 0 010-7.547 5.333 5.333 0 017.546 0l.16.16a4.401 4.401 0 004.854.88H24a4.4 4.4 0 002.667-4.027V8A5.332 5.332 0 0132 2.667zM32 24a8 8 0 100 16 8 8 0 000-16z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$3;

function _extends$5() { _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }

function SvgIconSpinner(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$5({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$3 || (_path$3 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-spinner_svg__fill",
    d: "M32 61.333C48.2 61.333 61.333 48.2 61.333 32S48.2 2.667 32 2.667 2.667 15.8 2.667 32a2.838 2.838 0 105.678 0C8.344 18.935 18.934 8.344 32 8.344c13.065 0 23.656 10.591 23.656 23.656S45.065 55.656 32 55.656a2.838 2.838 0 100 5.677z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$2;

function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }

function SvgIconSupergroup(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-supergroup_svg__fill",
    d: "M36.889 43.013c6.608 0 12.121 4.685 12.43 10.734l.014.537V58a2.667 2.667 0 01-5.316.311L44 58v-3.716c0-3.07-2.87-5.718-6.636-5.925l-.475-.013H27.11c-3.838 0-6.86 2.525-7.096 5.557l-.015.381V58a2.667 2.667 0 01-5.315.311L14.667 58v-3.716c0-6.126 5.324-10.986 11.864-11.26l.58-.011h9.778zm18.578-17.291c.266 0 .53.04.784.118 4.632 1.426 7.518 4.801 7.736 9.688l.013.594v12.8a2.667 2.667 0 01-5.315.311l-.018-.311V36.124c-.002-2.595-1.163-4.171-3.528-5.034l-.104-.037-2.502.002a2.667 2.667 0 01-2.648-2.356l-.018-.31a2.67 2.67 0 012.355-2.65l.311-.017h2.934zm-44 0l.31.018a2.666 2.666 0 012.356 2.648l-.018.311a2.666 2.666 0 01-2.648 2.356l-2.51-.002-.119.042c-2.246.85-3.503 2.574-3.505 5.147v12.68l-.018.31A2.666 2.666 0 010 48.922V36.24l.014-.591c.225-4.874 3.203-8.415 7.712-9.809.255-.078.52-.118.788-.118h2.953zM32 19.958c5.512 0 10 4.409 10 9.871 0 5.463-4.488 9.872-10 9.872s-10-4.41-10-9.872 4.488-9.871 10-9.871zm0 5.333c-2.588 0-4.667 2.043-4.667 4.538 0 2.496 2.08 4.538 4.667 4.538 2.588 0 4.667-2.042 4.667-4.538 0-2.495-2.08-4.538-4.667-4.538zM17.333 2.667c5.513 0 10 4.409 10 9.871 0 5.462-4.487 9.871-10 9.871-5.512 0-10-4.409-10-9.871 0-5.462 4.488-9.871 10-9.871zm29.334 0c5.512 0 10 4.409 10 9.871 0 5.462-4.488 9.871-10 9.871-5.513 0-10-4.409-10-9.871 0-5.462 4.487-9.871 10-9.871zM17.333 8c-2.587 0-4.666 2.042-4.666 4.538 0 2.496 2.079 4.538 4.666 4.538 2.588 0 4.667-2.042 4.667-4.538C22 10.042 19.921 8 17.333 8zm29.334 0C44.079 8 42 10.042 42 12.538c0 2.496 2.079 4.538 4.667 4.538 2.587 0 4.666-2.042 4.666-4.538 0-2.496-2.079-4.538-4.666-4.538z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _path$1;

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

function SvgIconThumbnailNone(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path$1 || (_path$1 = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-thumbnail-none_svg__fill",
    d: "M34.667 5.333a2.667 2.667 0 010 5.334H13.333a2.667 2.667 0 00-2.666 2.666v37.334c0 1.143.72 2.118 1.73 2.497l28.384-28.383a2.667 2.667 0 013.771 0l8.781 8.78v-4.228a2.667 2.667 0 012.498-2.661l.169-.005a2.667 2.667 0 012.667 2.666v21.334a8 8 0 01-8 8H13.33a8 8 0 01-7.998-8V13.333a8 8 0 018-8zm8 25.105L19.77 53.333h30.897a2.667 2.667 0 002.661-2.498l.005-.168v-9.563L42.667 30.438zM22.667 16a6.666 6.666 0 110 13.333 6.666 6.666 0 010-13.333zm0 5.333a1.334 1.334 0 100 2.667 1.334 1.334 0 000-2.667zM56.78 3.448a2.665 2.665 0 013.771 0 2.665 2.665 0 010 3.771l-4.782 4.78 4.782 4.782c.998.998 1.04 2.59.125 3.638l-.125.133a2.665 2.665 0 01-3.771 0l-4.782-4.781-4.78 4.781a2.667 2.667 0 01-3.638.125l-.133-.125a2.665 2.665 0 010-3.771L48.228 12l-4.78-4.781a2.667 2.667 0 01-.125-3.638l.125-.133a2.665 2.665 0 013.771 0l4.78 4.78z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var _g$1;

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

function SvgIconToggleoff(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 88 48"
  }, props), _g$1 || (_g$1 = /*#__PURE__*/React__namespace.createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/React__namespace.createElement("rect", {
    className: "icon-toggleoff_svg__fill",
    width: 80,
    height: 40,
    x: 4,
    y: 4,
    fill: "#000",
    rx: 20
  }), /*#__PURE__*/React__namespace.createElement("circle", {
    cx: 24,
    cy: 24,
    r: 12,
    fill: "#FFF"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#FFF",
    d: "M64 4c11.046 0 20 8.954 20 20s-8.954 20-20 20H24C12.954 44 4 35.046 4 24S12.954 4 24 4h40zm0 2H24C14.059 6 6 14.059 6 24c0 9.764 7.774 17.712 17.47 17.992L24 42h40c9.941 0 18-8.059 18-18 0-9.764-7.774-17.712-17.47-17.992L64 6z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-toggleoff_svg__fill",
    fill: "#000",
    d: "M64 0H24C10.745 0 0 10.745 0 24s10.745 24 24 24h40c13.255 0 24-10.745 24-24S77.255 0 64 0zm0 4c11.046 0 20 8.954 20 20s-8.954 20-20 20H24C12.954 44 4 35.046 4 24S12.954 4 24 4h40z"
  }))));
}

var _g;

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

function SvgIconToggleon(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 88 48"
  }, props), _g || (_g = /*#__PURE__*/React__namespace.createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/React__namespace.createElement("rect", {
    className: "icon-toggleon_svg__fill",
    width: 80,
    height: 40,
    x: 4,
    y: 4,
    fill: "#000",
    rx: 20
  }), /*#__PURE__*/React__namespace.createElement("circle", {
    cx: 64,
    cy: 24,
    r: 12,
    fill: "#FFF"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    fill: "#FFF",
    d: "M64 4c11.046 0 20 8.954 20 20s-8.954 20-20 20H24C12.954 44 4 35.046 4 24S12.954 4 24 4h40zm0 2H24C14.059 6 6 14.059 6 24c0 9.764 7.774 17.712 17.47 17.992L24 42h40c9.941 0 18-8.059 18-18 0-9.764-7.774-17.712-17.47-17.992L64 6z"
  }), /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-toggleon_svg__fill",
    fill: "#000",
    d: "M64 0H24C10.745 0 0 10.745 0 24s10.745 24 24 24h40c13.255 0 24-10.745 24-24S77.255 0 64 0zm0 4c11.046 0 20 8.954 20 20s-8.954 20-20 20H24C12.954 44 4 35.046 4 24S12.954 4 24 4h40z"
  }))));
}

var _path;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function SvgIconUser(props) {
  return /*#__PURE__*/React__namespace.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64"
  }, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
    className: "icon-user_svg__fill",
    d: "M42.667 37.333c7.17 0 13.018 5.66 13.32 12.755l.013.579V56a2.667 2.667 0 01-5.315.311L50.667 56v-5.333c0-4.26-3.33-7.743-7.53-7.987l-.47-.013H21.333a8 8 0 00-7.986 7.53l-.014.47V56a2.667 2.667 0 01-5.316.311L8 56v-5.333c0-7.17 5.66-13.019 12.755-13.321l.578-.013h21.334zM32 5.333c7.364 0 13.333 5.97 13.333 13.334C45.333 26.03 39.363 32 32 32c-7.364 0-13.333-5.97-13.333-13.333 0-7.364 5.97-13.334 13.333-13.334zm0 5.334a8 8 0 100 16 8 8 0 000-16z",
    fill: "#000",
    fillRule: "evenodd"
  })));
}

var Colors$1 = {
  DEFAULT: 'DEFAULT',
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  CONTENT: 'CONTENT',
  CONTENT_INVERSE: 'CONTENT_INVERSE',
  WHITE: 'WHITE',
  SENT: 'SENT',
  READ: 'READ',
  ON_BACKGROUND_1: 'ON_BACKGROUND_1',
  ON_BACKGROUND_2: 'ON_BACKGROUND_2',
  ON_BACKGROUND_3: 'ON_BACKGROUND_3',
  BACKGROUND_3: 'BACKGROUND_3',
  ERROR: 'ERROR'
};

function changeColorToClassName$1(color) {
  switch (color) {
    case Colors$1.PRIMARY:
      return 'sendbird-icon-color--primary';

    case Colors$1.SECONDARY:
      return 'sendbird-icon-color--secondary';

    case Colors$1.CONTENT:
      return 'sendbird-icon-color--content';

    case Colors$1.CONTENT_INVERSE:
      return 'sendbird-icon-color--content-inverse';

    case Colors$1.WHITE:
      return 'sendbird-icon-color--white';

    case Colors$1.SENT:
      return 'sendbird-icon-color--sent';

    case Colors$1.READ:
      return 'sendbird-icon-color--read';

    case Colors$1.ON_BACKGROUND_1:
      return 'sendbird-icon-color--on-background-1';

    case Colors$1.ON_BACKGROUND_2:
      return 'sendbird-icon-color--on-background-2';

    case Colors$1.ON_BACKGROUND_3:
      return 'sendbird-icon-color--on-background-3';

    case Colors$1.BACKGROUND_3:
      return 'sendbird-icon-color--background-3';

    case Colors$1.ERROR:
      return 'sendbird-icon-color--error';

    default:
      return '';
  }
}

function changeTypeToIconComponent(type) {
  switch (type) {
    case Type.ADD:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconAdd, null);

    case Type.ARROW_LEFT:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconArrowLeft, null);

    case Type.ATTACH:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconAttach, null);

    case Type.BAN:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconBan, null);

    case Type.BROADCAST:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconBroadcast, null);

    case Type.CAMERA:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconCamera, null);

    case Type.CHANNELS:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconChannels, null);

    case Type.CHAT:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconChat, null);

    case Type.CHAT_FILLED:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconChatFilled, null);

    case Type.CHEVRON_DOWN:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconChevronDown, null);

    case Type.CHEVRON_RIGHT:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconChevronRight, null);

    case Type.CLOSE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconClose, null);

    case Type.COLLAPSE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconCollapse, null);

    case Type.COPY:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconCopy, null);

    case Type.CREATE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconCreate, null);

    case Type.DELETE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconDelete, null);

    case Type.DISCONNECTED:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconDisconnected, null);

    case Type.DOCUMENT:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconDocument, null);

    case Type.DONE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconDone, null);

    case Type.DONE_ALL:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconDoneAll, null);

    case Type.DOWNLOAD:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconDownload, null);

    case Type.EDIT:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconEdit, null);

    case Type.EMOJI_MORE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconEmojiMore, null);

    case Type.ERROR:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconError, null);

    case Type.EXPAND:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconExpand, null);

    case Type.FILE_AUDIO:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconFileAudio, null);

    case Type.FILE_DOCUMENT:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconFileDocument, null);

    case Type.FREEZE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconFreeze, null);

    case Type.GIF:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconGif, null);

    case Type.INFO:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconInfo, null);

    case Type.LEAVE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconLeave, null);

    case Type.MEMBERS:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconMembers, null);

    case Type.MESSAGE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconMessage, null);

    case Type.MODERATIONS:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconModerations, null);

    case Type.MORE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconMore, null);

    case Type.MUTE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconMute, null);

    case Type.NOTIFICATIONS:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconNotifications, null);

    case Type.NOTIFICATIONS_OFF_FILLED:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconNotificationsOffFilled, null);

    case Type.OPERATOR:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconOperator, null);

    case Type.PHOTO:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconPhoto, null);

    case Type.PLAY:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconPlay, null);

    case Type.PLUS:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconPlus, null);

    case Type.QUESTION:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconQuestion, null);

    case Type.REFRESH:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconRefresh, null);

    case Type.REMOVE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconRemove, null);

    case Type.REPLY:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconReplyFilled, null);

    case Type.SEARCH:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconSearch, null);

    case Type.SEND:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconSend, null);

    case Type.SETTINGS_FILLED:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconSettingsFilled, null);

    case Type.SPINNER:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconSpinner, null);

    case Type.SUPERGROUP:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconSupergroup, null);

    case Type.THUMBNAIL_NONE:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconThumbnailNone, null);

    case Type.TOGGLE_OFF:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconToggleoff, null);

    case Type.TOGGLE_ON:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconToggleon, null);

    case Type.USER:
      return /*#__PURE__*/React__default["default"].createElement(SvgIconUser, null);

    default:
      return 'icon';
    // If you see this text 'icon' replace icon for it
  }
}

function changeTypeToIconClassName(type) {
  switch (type) {
    case Type.ADD:
      return 'sendbird-icon-add';

    case Type.ARROW_LEFT:
      return 'sendbird-icon-arrow-left';

    case Type.ATTACH:
      return 'sendbird-icon-attach';

    case Type.BAN:
      return 'sendbird-icon-ban';

    case Type.BROADCAST:
      return 'sendbird-icon-broadcast';

    case Type.CAMERA:
      return 'sendbird-icon-camera';

    case Type.CHANNELS:
      return 'sendbird-icon-channels';

    case Type.CHAT:
      return 'sendbird-icon-chat';

    case Type.CHAT_FILLED:
      return 'sendbird-icon-chat-filled';

    case Type.CHEVRON_DOWN:
      return 'sendbird-icon-chevron-down';

    case Type.CHEVRON_RIGHT:
      return 'sendbird-icon-chevron-right';

    case Type.CLOSE:
      return 'sendbird-icon-close';

    case Type.COLLAPSE:
      return 'sendbird-icon-collapse';

    case Type.COPY:
      return 'sendbird-icon-copy';

    case Type.CREATE:
      return 'sendbird-icon-create';

    case Type.DELETE:
      return 'sendbird-icon-delete';

    case Type.DISCONNECTED:
      return 'sendbird-icon-disconnected';

    case Type.DOCUMENT:
      return 'sendbird-icon-document';

    case Type.DONE:
      return 'sendbird-icon-done';

    case Type.DONE_ALL:
      return 'sendbird-icon-done-all';

    case Type.DOWNLOAD:
      return 'sendbird-icon-down-load';

    case Type.EDIT:
      return 'sendbird-icon-edit';

    case Type.EMOJI_MORE:
      return 'sendbird-icon-emoji-more';

    case Type.ERROR:
      return 'sendbird-icon-error';

    case Type.EXPAND:
      return 'sendbird-icon-expand';

    case Type.FILE_AUDIO:
      return 'sendbird-icon-file-audio';

    case Type.FILE_DOCUMENT:
      return 'sendbird-icon-file-document';

    case Type.FREEZE:
      return 'sendbird-icon-freeze';

    case Type.GIF:
      return 'sendbird-icon-gif';

    case Type.INFO:
      return 'sendbird-icon-info';

    case Type.LEAVE:
      return 'sendbird-icon-leave';

    case Type.MEMBERS:
      return 'sendbird-icon-members';

    case Type.MESSAGE:
      return 'sendbird-icon-message';

    case Type.MODERATIONS:
      return 'sendbird-icon-moderations';

    case Type.MORE:
      return 'sendbird-icon-more';

    case Type.MUTE:
      return 'sendbird-icon-mute';

    case Type.NOTIFICATIONS:
      return 'sendbird-icon-notifications';

    case Type.NOTIFICATIONS_OFF_FILLED:
      return 'sendbird-icon-notifications-off-filled';

    case Type.OPERATOR:
      return 'sendbird-icon-operator';

    case Type.PHOTO:
      return 'sendbird-icon-photo';

    case Type.PLAY:
      return 'sendbird-icon-play';

    case Type.PLUS:
      return 'sendbird-iconn-plus';

    case Type.QUESTION:
      return 'sendbird-icon-question';

    case Type.REFRESH:
      return 'sendbird-icon-refresh';

    case Type.REMOVE:
      return 'sendbird-icon-remove';

    case Type.REPLY:
      return 'sendbird-icon-reply';

    case Type.SEARCH:
      return 'sendbird-icon-search';

    case Type.SEND:
      return 'sendbird-icon-send';

    case Type.SETTINGS_FILLED:
      return 'sendbird-icon-settings-filled';

    case Type.SPINNER:
      return 'sendbird-icon-spinner';

    case Type.SUPERGROUP:
      return 'sendbird-icon-supergroup';

    case Type.THUMBNAIL_NONE:
      return 'sendbird-icon-thumbnail-none';

    case Type.TOGGLE_OFF:
      return 'sendbird-icon-toggle-off';

    case Type.TOGGLE_ON:
      return 'sendbird-icon-toggle-on';

    case Type.USER:
      return 'sendbird-icon-user';

    default:
      return 'sendbird-icon-unknown';
    // If you see this text 'icon' replace icon for it
  }
}
function Icon(_ref) {
  var className = _ref.className,
      type = _ref.type,
      fillColor = _ref.fillColor,
      width = _ref.width,
      height = _ref.height,
      onClick = _ref.onClick,
      children = _ref.children;
  var iconStyle = {
    width: typeof width === 'string' ? width : "".concat(width, "px"),
    minWidth: typeof width === 'string' ? width : "".concat(width, "px"),
    height: typeof height === 'string' ? height : "".concat(height, "px"),
    minHeight: typeof height === 'string' ? height : "".concat(height, "px")
  };
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-icon', changeTypeToIconClassName(type), changeColorToClassName$1(fillColor)]).join(' '),
    role: "button",
    onClick: onClick,
    onKeyDown: onClick,
    tabIndex: "0",
    style: iconStyle
  }, children || changeTypeToIconComponent(type));
}
Icon.propTypes = {
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)]),
  type: PropTypes__default["default"].oneOfType([PropTypes__default["default"].oneOf(Object.keys(Type)), PropTypes__default["default"].string]).isRequired,
  fillColor: PropTypes__default["default"].oneOf(Object.keys(Colors$1)),
  width: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  height: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  onClick: PropTypes__default["default"].func,
  children: PropTypes__default["default"].element
};
Icon.defaultProps = {
  className: '',
  fillColor: Colors$1.DEFAULT,
  width: 26,
  height: 26,
  onClick: function onClick() {},
  children: null
};
var IconTypes = Type;
var IconColors = Colors$1;

var pxToNumber = (function (px) {
  if (typeof px === 'number') {
    return px;
  }

  if (typeof px === 'string') {
    var parsed = Number.parseFloat(px);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
});

var imageRendererClassName = 'sendbird-avatar-img';

var DefaultComponent = function DefaultComponent(_a) {
  var width = _a.width,
      height = _a.height;
  var iconWidth = pxToNumber(width);
  var iconHeight = pxToNumber(height);

  if (typeof iconWidth === 'number') {
    iconWidth *= 0.575;
  }

  if (typeof iconHeight === 'number') {
    iconHeight *= 0.575;
  }

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-avatar-img--default",
    style: {
      width: width,
      height: height
    }
  }, /*#__PURE__*/React__default["default"].createElement(Icon, {
    type: IconTypes.USER,
    fillColor: IconColors.CONTENT,
    width: iconWidth,
    height: iconHeight
  }));
};

var _defaultComponent = function _defaultComponent(_a) {
  var width = _a.width,
      height = _a.height;
  return /*#__PURE__*/React__default["default"].createElement(DefaultComponent, {
    width: width,
    height: height
  });
};

var AvatarInner = function AvatarInner(_a) {
  var _b = _a.src,
      src = _b === void 0 ? '' : _b,
      _c = _a.alt,
      alt = _c === void 0 ? '' : _c,
      height = _a.height,
      width = _a.width,
      customDefaultComponent = _a.customDefaultComponent;

  var defaultComponent = function defaultComponent() {
    return customDefaultComponent ? customDefaultComponent({
      width: width,
      height: height
    }) : _defaultComponent({
      width: width,
      height: height
    });
  };

  if (typeof src === 'string') {
    return /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
      className: imageRendererClassName,
      url: src,
      height: height,
      width: width,
      alt: alt,
      defaultComponent: defaultComponent
    });
  }

  if (src && src.length) {
    if (src.length === 1) {
      return /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
        className: imageRendererClassName,
        url: src[0],
        height: height,
        width: width,
        alt: alt,
        defaultComponent: defaultComponent
      });
    }

    if (src.length === 2) {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: "sendbird-avatar--inner__two-child"
      }, /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
        className: imageRendererClassName,
        url: src[0],
        height: height,
        width: width,
        alt: alt,
        defaultComponent: defaultComponent
      }), /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
        className: imageRendererClassName,
        url: src[1],
        height: height,
        width: width,
        alt: alt,
        defaultComponent: defaultComponent
      }));
    }

    if (src.length === 3) {
      return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
        className: "sendbird-avatar--inner__three-child--upper"
      }, /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
        className: imageRendererClassName,
        url: src[0],
        height: height,
        width: width,
        alt: alt,
        defaultComponent: defaultComponent
      })), /*#__PURE__*/React__default["default"].createElement("div", {
        className: "sendbird-avatar--inner__three-child--lower"
      }, /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
        className: imageRendererClassName,
        url: src[1],
        height: height,
        width: width,
        alt: alt,
        defaultComponent: defaultComponent
      }), /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
        className: imageRendererClassName,
        url: src[2],
        height: height,
        width: width,
        alt: alt,
        defaultComponent: defaultComponent
      })));
    }

    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-avatar--inner__four-child"
    }, src.slice(0, 4).map(function (i) {
      return /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
        className: imageRendererClassName,
        url: i,
        height: height,
        width: width,
        alt: alt,
        key: LocalizationContext.uuidv4(),
        defaultComponent: defaultComponent
      });
    }));
  } // default img


  return /*#__PURE__*/React__default["default"].createElement(ImageRenderer, {
    className: imageRendererClassName,
    url: "",
    height: height,
    width: width,
    alt: alt,
    defaultComponent: defaultComponent
  });
};

function Avatar(_a, ref) {
  var _b = _a.className,
      className = _b === void 0 ? '' : _b,
      _c = _a.src,
      src = _c === void 0 ? '' : _c,
      _d = _a.alt,
      alt = _d === void 0 ? '' : _d,
      _e = _a.width,
      width = _e === void 0 ? '56px' : _e,
      _f = _a.height,
      height = _f === void 0 ? '56px' : _f,
      onClick = _a.onClick,
      customDefaultComponent = _a.customDefaultComponent;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: LocalizationContext.__spreadArray(LocalizationContext.__spreadArray([], Array.isArray(className) ? className : [className], true), ['sendbird-avatar'], false).join(' '),
    role: "button",
    ref: ref,
    style: {
      height: height,
      width: width
    },
    onClick: onClick,
    onKeyDown: onClick,
    tabIndex: 0
  }, /*#__PURE__*/React__default["default"].createElement(AvatarInner, {
    src: src,
    width: width,
    height: height,
    alt: alt,
    customDefaultComponent: customDefaultComponent
  }));
}

var Avatar$1 = /*#__PURE__*/React__default["default"].forwardRef(Avatar);

var Typography = {
  H_1: 'H_1',
  H_2: 'H_2',
  SUBTITLE_1: 'SUBTITLE_1',
  SUBTITLE_2: 'SUBTITLE_2',
  BODY_1: 'BODY_1',
  BODY_2: 'BODY_2',
  BUTTON_1: 'BUTTON_1',
  BUTTON_2: 'BUTTON_2',
  CAPTION_1: 'CAPTION_1',
  CAPTION_2: 'CAPTION_2',
  CAPTION_3: 'CAPTION_3'
};
var Colors = {
  ONBACKGROUND_1: 'ONBACKGROUND_1',
  ONBACKGROUND_2: 'ONBACKGROUND_2',
  ONBACKGROUND_3: 'ONBACKGROUND_3',
  ONBACKGROUND_4: 'ONBACKGROUND_4',
  ONCONTENT_1: 'ONCONTENT_1',
  ONCONTENT_2: 'ONCONTENT_2',
  PRIMARY: 'PRIMARY',
  ERROR: 'ERROR',
  SECONDARY_3: 'SECONDARY_3'
};

function changeTypographyToClassName(type) {
  switch (type) {
    case Typography.H_1:
      return 'sendbird-label--h-1';

    case Typography.H_2:
      return 'sendbird-label--h-2';

    case Typography.SUBTITLE_1:
      return 'sendbird-label--subtitle-1';

    case Typography.SUBTITLE_2:
      return 'sendbird-label--subtitle-2';

    case Typography.BODY_1:
      return 'sendbird-label--body-1';

    case Typography.BODY_2:
      return 'sendbird-label--body-2';

    case Typography.BUTTON_1:
      return 'sendbird-label--button-1';

    case Typography.BUTTON_2:
      return 'sendbird-label--button-2';

    case Typography.CAPTION_1:
      return 'sendbird-label--caption-1';

    case Typography.CAPTION_2:
      return 'sendbird-label--caption-2';

    case Typography.CAPTION_3:
      return 'sendbird-label--caption-3';

    default:
      return null;
  }
}
function changeColorToClassName(color) {
  switch (color) {
    case Colors.ONBACKGROUND_1:
      return 'sendbird-label--color-onbackground-1';

    case Colors.ONBACKGROUND_2:
      return 'sendbird-label--color-onbackground-2';

    case Colors.ONBACKGROUND_3:
      return 'sendbird-label--color-onbackground-3';

    case Colors.ONBACKGROUND_4:
      return 'sendbird-label--color-onbackground-4';

    case Colors.ONCONTENT_1:
      return 'sendbird-label--color-oncontent-1';

    case Colors.ONCONTENT_2:
      return 'sendbird-label--color-oncontent-2';

    case Colors.PRIMARY:
      return 'sendbird-label--color-primary';
    // should be Primary-3 fix me

    case Colors.ERROR:
      return 'sendbird-label--color-error';

    case Colors.SECONDARY_3:
      return 'sendbird-label--color-secondary-3';

    default:
      return null;
  }
}

function Label(_ref) {
  var className = _ref.className,
      type = _ref.type,
      color = _ref.color,
      children = _ref.children;
  return /*#__PURE__*/React__default["default"].createElement("span", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-label', type ? changeTypographyToClassName(type) : '', color ? changeColorToClassName(color) : '']).join(' ')
  }, children);
}
Label.propTypes = {
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)]),
  type: PropTypes__default["default"].oneOf([].concat(LocalizationContext._toConsumableArray(Object.keys(Typography)), [''])),
  color: PropTypes__default["default"].oneOf([].concat(LocalizationContext._toConsumableArray(Object.keys(Colors)), [''])),
  children: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number, PropTypes__default["default"].element, PropTypes__default["default"].any])
};
Label.defaultProps = {
  className: [],
  type: '',
  color: '',
  children: null
};
var LabelTypography = Typography;
var LabelColors = Colors;
var LabelStringSet = LocalizationContext.getStringSet('en');

function Types() {
  return {
    LOADING: 'LOADING',
    NO_CHANNELS: 'NO_CHANNELS',
    NO_MESSAGES: 'NO_MESSAGES',
    WRONG: 'WRONG',
    SEARCH_IN: 'SEARCH_IN',
    SEARCHING: 'SEARCHING',
    NO_RESULTS: 'NO_RESULTS'
  };
}
var PlaceHolderTypes$1 = Types();

function Loader(_ref) {
  var className = _ref.className,
      width = _ref.width,
      height = _ref.height,
      children = _ref.children;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-loader']).join(' '),
    style: {
      width: typeof width === 'string' ? width : "".concat(width, "px"),
      height: typeof height === 'string' ? height : "".concat(height, "px")
    }
  }, children);
}
Loader.propTypes = {
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)]),
  width: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  height: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  children: PropTypes__default["default"].element
};
Loader.defaultProps = {
  className: '',
  width: '26px',
  height: '26px',
  children: /*#__PURE__*/React__default["default"].createElement(Icon, {
    type: IconTypes.SPINNER,
    width: "26px",
    height: "26px"
  })
};

var PlaceHolderTypes = PlaceHolderTypes$1;
function PlaceHolder(_ref) {
  var className = _ref.className,
      type = _ref.type,
      retryToConnect = _ref.retryToConnect,
      searchInString = _ref.searchInString;

  var _useContext = React.useContext(LocalizationContext.LocalizationContext),
      stringSet = _useContext.stringSet;

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-place-holder']).join(' ')
  }, type === PlaceHolderTypes.LOADING && /*#__PURE__*/React__default["default"].createElement(Loader, {
    width: "48px",
    height: "48px"
  }, /*#__PURE__*/React__default["default"].createElement(Icon, {
    type: IconTypes.SPINNER,
    fillColor: IconColors.PRIMARY,
    width: "48px",
    height: "48px"
  })), (type === PlaceHolderTypes.NO_CHANNELS || type === PlaceHolderTypes.NO_MESSAGES || type === PlaceHolderTypes.WRONG) && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-place-holder__body"
  }, type === PlaceHolderTypes.NO_CHANNELS && /*#__PURE__*/React__default["default"].createElement(Icon, {
    className: "sendbird-place-holder__body__icon",
    type: IconTypes.CHAT,
    fillColor: IconColors.ON_BACKGROUND_3,
    width: "64px",
    height: "64px"
  }), type === PlaceHolderTypes.WRONG && /*#__PURE__*/React__default["default"].createElement(Icon, {
    className: "sendbird-place-holder__body__icon",
    type: IconTypes.ERROR,
    fillColor: IconColors.ON_BACKGROUND_3,
    width: "64px",
    height: "64px"
  }), type === PlaceHolderTypes.NO_MESSAGES && /*#__PURE__*/React__default["default"].createElement(Icon, {
    className: "sendbird-place-holder__body__icon",
    type: IconTypes.MESSAGE,
    fillColor: IconColors.ON_BACKGROUND_3,
    width: "64px",
    height: "64px"
  }), /*#__PURE__*/React__default["default"].createElement(Label, {
    className: "sendbird-place-holder__body__text",
    type: LabelTypography.BODY_1,
    color: LabelColors.ONBACKGROUND_2
  }, type === PlaceHolderTypes.NO_CHANNELS && stringSet.PLACE_HOLDER__NO_CHANNEL, type === PlaceHolderTypes.WRONG && stringSet.PLACE_HOLDER__WRONG, type === PlaceHolderTypes.NO_MESSAGES && stringSet.PLACE_HOLDER__NO_MESSAGES), retryToConnect && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-place-holder__body__reconnect",
    role: "button",
    onClick: retryToConnect,
    onKeyPress: retryToConnect,
    tabIndex: 0
  }, /*#__PURE__*/React__default["default"].createElement(Icon, {
    className: "sendbird-place-holder__body__reconnect__icon",
    type: IconTypes.REFRESH,
    fillColor: IconColors.PRIMARY,
    width: "20px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement(Label, {
    className: "sendbird-place-holder__body__reconnect__text",
    type: LabelTypography.BUTTON_1,
    color: LabelColors.PRIMARY
  }, stringSet.PLACE_HOLDER__RETRY_TO_CONNECT))), (type === PlaceHolderTypes.NO_RESULTS || type === PlaceHolderTypes.SEARCH_IN || type === PlaceHolderTypes.SEARCHING) && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-place-holder__body--align-top"
  }, type === PlaceHolderTypes.SEARCH_IN && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-place-holder__body--align-top__text"
  }, /*#__PURE__*/React__default["default"].createElement(Label, {
    className: "sendbird-place-holder__body--align-top__text__search-in",
    type: LabelTypography.BUTTON_2,
    color: LabelColors.ONBACKGROUND_2
  }, stringSet.SEARCH_IN), /*#__PURE__*/React__default["default"].createElement(Label, {
    className: "sendbird-place-holder__body--align-top__text__channel-name",
    type: LabelTypography.BUTTON_2,
    color: LabelColors.PRIMARY
  }, "'".concat(searchInString)), /*#__PURE__*/React__default["default"].createElement(Label, {
    className: "sendbird-place-holder__body--align-top__text__quote",
    type: LabelTypography.BUTTON_2,
    color: LabelColors.PRIMARY
  }, '\'')), type === PlaceHolderTypes.SEARCHING && /*#__PURE__*/React__default["default"].createElement(Label, {
    className: "sendbird-place-hlder__body--align-top__searching",
    type: LabelTypography.BODY_1,
    color: LabelColors.ONBACKGROUND_2
  }, stringSet.SEARCHING), type === PlaceHolderTypes.NO_RESULTS && /*#__PURE__*/React__default["default"].createElement(Label, {
    className: "sendbird-place-hlder__body--align-top__no-result",
    type: LabelTypography.BODY_1,
    color: LabelColors.ONBACKGROUND_2
  }, stringSet.NO_SEARCHED_MESSAGE)));
}
PlaceHolder.propTypes = {
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)]),
  type: PropTypes__default["default"].oneOfType([PropTypes__default["default"].oneOf(Object.keys(PlaceHolderTypes)), PropTypes__default["default"].string]).isRequired,
  retryToConnect: PropTypes__default["default"].func,
  searchInString: PropTypes__default["default"].string
};
PlaceHolder.defaultProps = {
  className: '',
  retryToConnect: null,
  searchInString: ''
};

exports.Avatar = Avatar$1;
exports.Icon = Icon;
exports.IconColors = IconColors;
exports.IconTypes = IconTypes;
exports.ImageRenderer = ImageRenderer;
exports.Label = Label;
exports.LabelColors = LabelColors;
exports.LabelStringSet = LabelStringSet;
exports.LabelTypography = LabelTypography;
exports.Loader = Loader;
exports.PlaceHolder = PlaceHolder;
exports.PlaceHolderTypes = PlaceHolderTypes$1;
exports.PlaceHolderTypes$1 = PlaceHolderTypes;
exports.changeColorToClassName = changeColorToClassName;
exports.format = format;
exports.requiredArgs = requiredArgs;
exports.toDate = toDate;
exports.toInteger = toInteger;
//# sourceMappingURL=index-ef8b2d5d.js.map
