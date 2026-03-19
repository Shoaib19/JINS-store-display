import { format } from "date-fns";
import {
  fixSystemDate,
  fixSystemDatetimeForDpfm,
  fixSystemDatetimeForFront,
  fixDate,
  fixDatetimeForDpfm,
  fixDatetimeForFront,
  fixDatetimeForFrontFromDpfm,
  toUTCDateFromString,
  fixTime,
  fixSystemTime,
} from "~/src/utils/fixDatetime";

describe("fixDatetime", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    // jest.setSystemTime(new Date('2024-08-29T12:34:56Z'));
  });

  const toUtcDate = (
    utcYear: number,
    utcMonth: number,
    utcDate: number,
    utcHour: number,
    utcMinutes: number,
    utcSeconds: number
    // utcMilliseconds?: number
  ) =>
    new Date(
      Date.UTC(
        utcYear,
        utcMonth - 1,
        utcDate,
        utcHour,
        utcMinutes,
        utcSeconds
        // utcMilliseconds
      )
    );

  const toUtcDateActual = (actual?: Date|null) => {
    if( actual != undefined) 
    return new Date(
      Date.UTC(
        actual.getFullYear(),
        actual.getUTCMonth(),
        actual.getUTCDate(),
        actual.getUTCHours(),
        actual.getUTCMinutes(),
        actual.getUTCSeconds(),
        // actual.getUTCMilliseconds()
      )
    );
  }

  const toTimeStringFromUTCDate = (date: Date|undefined|null, outFormat: string) => {
    if(!date) return date;
    const utcDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getMilliseconds()
    );
    return format(utcDate, outFormat);
  };

  test("fixDate", async () => {
    interface TestCase {
      date: Date | undefined | null;
      timezone?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: "America/Los_Angeles",
        expect: "2024-12-24",
      },
      {
        date: toUtcDate(2024, 12, 24, 7, 59, 59),
        timezone: "America/Los_Angeles",
        expect: "2024-12-23",
      },
      {
        date: toUtcDate(2024, 12, 24, 8, 0, 0),
        timezone: "America/Los_Angeles",
        expect: "2024-12-24",
      },
      {
        date: toUtcDate(2024, 5, 24, 6, 59, 59),
        timezone: "America/Los_Angeles",
        expect: "2024-05-23",
      },
      {
        date: toUtcDate(2024, 5, 24, 7, 0, 0),
        timezone: "America/Los_Angeles",
        expect: "2024-05-24",
      },
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: "-06:00",
        expect: "2024-12-24",
      },
      {
        date: toUtcDate(2024, 12, 24, 5, 59, 59),
        timezone: "-06:00",
        expect: "2024-12-23",
      },
      {
        date: toUtcDate(2024, 12, 24, 6, 0, 0),
        timezone: "-06:00",
        expect: "2024-12-24",
      },
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: undefined,
        expect: "2024-12-24",
      },
      {
        date: undefined,
        timezone: undefined,
        expect: null,
      },
      {
        date: null,
        timezone: undefined,
        expect: null,
      },
    ];
    tests.forEach((test) => {
      {
        // 文字列型
        const actual = fixDate(
          toTimeStringFromUTCDate(test.date, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          test.timezone
        );
        expect(actual).toBe(test.expect);
      }
      {
        // Date型
        const actual = fixDate(test.date, test.timezone);
        expect(actual).toBe(test.expect);
      }
    });
  });

  test("fixTime", async () => {
    interface TestCase {
      date: Date | undefined | null;
      timezone?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: "America/Los_Angeles",
        expect: "04:34:56",
      },
      {
        date: toUtcDate(2024, 12, 24, 7, 59, 59),
        timezone: "America/Los_Angeles",
        expect: "23:59:59",
      },
      {
        date: toUtcDate(2024, 12, 24, 8, 0, 0),
        timezone: "America/Los_Angeles",
        expect: "00:00:00",
      },
      {
        date: toUtcDate(2024, 5, 24, 6, 59, 59),
        timezone: "America/Los_Angeles",
        expect: "23:59:59",
      },
      {
        date: toUtcDate(2024, 5, 24, 7, 0, 0),
        timezone: "America/Los_Angeles",
        expect: "00:00:00",
      },
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: "-06:00",
        expect: "06:34:56",
      },
      {
        date: toUtcDate(2024, 12, 24, 5, 59, 59),
        timezone: "-06:00",
        expect: "23:59:59",
      },
      {
        date: toUtcDate(2024, 12, 24, 6, 0, 0),
        timezone: "-06:00",
        expect: "00:00:00",
      },
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: undefined,
        expect: "12:34:56",
      },
      {
        date: undefined,
        timezone: undefined,
        expect: null,
      },
      {
        date: null,
        timezone: undefined,
        expect: null,
      },
    ];
    tests.forEach((test) => {
      {
        // 文字列型
        const actual = fixTime(
          toTimeStringFromUTCDate(test.date, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          test.timezone
        );
        expect(actual).toBe(test.expect);
      }
      {
        // Date型
        const actual = fixTime(test.date, test.timezone);
        expect(actual).toBe(test.expect);
      }
    });
  });

  test("fixDatetimeForDpfm", async () => {
    interface TestCase {
      date: Date | undefined | null;
      timezone?: number;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        expect: "2024-12-24T12:34:56",
      },
      {
        date: undefined,
        expect: null,
      },
      {
        date: null,
        expect: null,
      },
    ];
    tests.forEach((test) => {
      {
        // 文字列形式
        const actual = fixDatetimeForDpfm(
          toTimeStringFromUTCDate(test.date, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        );
        expect(actual).toBe(test.expect);
      }
      {
        // Dateオブジェクト形式
        const actual = fixDatetimeForDpfm(test.date);
        expect(actual).toBe(test.expect);
      }
    });
  });

  test("fixDatetimeForFront", async () => {
    interface TestCase {
      date: Date | undefined | null;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        expect: "2024-12-24T12:34:56Z",
      },
      {
        date: undefined,
        expect: null,
      },
      {
        date: null,
        expect: null,
      },
    ];
    tests.forEach((test) => {
      {
        // 文字列形式
        const actual = fixDatetimeForFront(
          toTimeStringFromUTCDate(test.date, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        );
        expect(actual).toBe(test.expect);
      }
      {
        // Dateオブジェクト形式
        const actual = fixDatetimeForFront(test.date);
        expect(actual).toBe(test.expect);
      }
    });
  });

  test("fixDatetimeForFrontFromDpfm", async () => {
    interface TestCase {
      date: Date;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        expect: "2024-12-24T12:34:56Z",
      },
    ];
    tests.forEach((test) => {
      {
        // Zなし
        const actual = fixDatetimeForFrontFromDpfm(
          toTimeStringFromUTCDate(test.date, "yyyy-MM-dd'T'HH:mm:ss")
        );
        expect(actual).toBe(test.expect);
      }
      {
        // Zあり
        const actual = fixDatetimeForFrontFromDpfm(
          toTimeStringFromUTCDate(test.date, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        );
        expect(actual).toBe(test.expect);
      }
    });
  });

  test("fixSystemDate", async () => {
    interface TestCase {
      now: Date;
      timezone?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone:'America/Los_Angeles',
        expect: "2024-12-24",
      },
      {
        now: toUtcDate(2024, 12, 24, 7, 59, 59),
        timezone:'America/Los_Angeles',
        expect: "2024-12-23",
      },
      {
        now: toUtcDate(2024, 12, 24, 8, 0, 0),
        timezone:'America/Los_Angeles',
        expect: "2024-12-24",
      },
      {
        now: toUtcDate(2024, 5, 24, 12, 34, 56),
        timezone:'America/Los_Angeles',
        expect: "2024-05-24",
      },
      {
        now: toUtcDate(2024, 5, 24, 6, 59, 59),
        timezone:'America/Los_Angeles',
        expect: "2024-05-23",
      },
      {
        now: toUtcDate(2024, 5, 24, 7, 0, 0),
        timezone:'America/Los_Angeles',
        expect: "2024-05-24",
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone:'-06:00',
        expect: "2024-12-24",
      },
      {
        now: toUtcDate(2024, 12, 24, 5, 59, 59),
        timezone:'-06:00',
        expect: "2024-12-23",
      },
      {
        now: toUtcDate(2024, 12, 24, 6, 0, 0),
        timezone:'-06:00',
        expect: "2024-12-24",
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone:'Asia/Tokyo',
        expect: "2024-12-24",
      },
      {
        now: toUtcDate(2024, 12, 24, 14, 59, 59),
        timezone:'Asia/Tokyo',
        expect: "2024-12-24",
      },
      {
        now: toUtcDate(2024, 12, 24, 15, 0, 0),
        timezone:'Asia/Tokyo',
        expect: "2024-12-25",
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: undefined,
        expect: "2024-12-24",
      },
    ];
    tests.forEach((test) => {
      jest.setSystemTime(test.now);
      const actual = fixSystemDate(
        test.timezone
      );
      expect(actual).toBe(test.expect);
    });
  });


  test("fixSystemTime", async () => {
    interface TestCase {
      now: Date;
      timezone?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone:'America/Los_Angeles',
        expect: "04:34:56",
      },
      {
        now: toUtcDate(2024, 12, 24, 7, 59, 59),
        timezone:'America/Los_Angeles',
        expect: "23:59:59",
      },
      {
        now: toUtcDate(2024, 12, 24, 8, 0, 0),
        timezone:'America/Los_Angeles',
        expect: "00:00:00",
      },
      {
        now: toUtcDate(2024, 5, 24, 12, 34, 56),
        timezone:'America/Los_Angeles',
        expect: "05:34:56",
      },
      {
        now: toUtcDate(2024, 5, 24, 6, 59, 59),
        timezone:'America/Los_Angeles',
        expect: "23:59:59",
      },
      {
        now: toUtcDate(2024, 5, 24, 7, 0, 0),
        timezone:'America/Los_Angeles',
        expect: "00:00:00",
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone:'-06:00',
        expect: "06:34:56",
      },
      {
        now: toUtcDate(2024, 12, 24, 5, 59, 59),
        timezone:'-06:00',
        expect: "23:59:59",
      },
      {
        now: toUtcDate(2024, 12, 24, 6, 0, 0),
        timezone:'-06:00',
        expect: "00:00:00",
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone:'Asia/Tokyo',
        expect: "21:34:56",
      },
      {
        now: toUtcDate(2024, 12, 24, 14, 59, 59),
        timezone:'Asia/Tokyo',
        expect: "23:59:59",
      },
      {
        now: toUtcDate(2024, 12, 24, 15, 0, 0),
        timezone:'Asia/Tokyo',
        expect: "00:00:00",
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: undefined,
        expect: "12:34:56",
      },
    ];
    tests.forEach((test) => {
      jest.setSystemTime(test.now);
      const actual = fixSystemTime(
        test.timezone
      );
      expect(actual).toBe(test.expect);
    });
  });

  test("fixSystemDatetimeForDpfm", async () => {
    interface TestCase {
      now: Date;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        expect: "2024-12-24T12:34:56",
      },
    ];
    tests.forEach((test) => {
      jest.setSystemTime(test.now);
      const actual = fixSystemDatetimeForDpfm();
      expect(actual).toBe(test.expect);
    });
  });

  test("fixSystemDatetimeForFront", async () => {
    interface TestCase {
      now: Date;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        expect: "2024-12-24T12:34:56Z",
      },
    ];
    tests.forEach((test) => {
      jest.setSystemTime(test.now);
      const actual = fixSystemDatetimeForFront(
        // test.timezone
      );
      expect(actual).toBe(test.expect);
    });
  });

  test("toUTCDateFromString", async () => {
    interface TestCase {
      date: string | undefined | null;
      timezone?: string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        date: "12/24/2024",
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 24 , 8, 0, 0),
      },
      {
        date: "2024-12-24",
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 24 , 8, 0, 0),
      },
      {
        date: "2024/12/24",
        timezone : 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 23 , 15, 0, 0),
      },
      {
        date: undefined,
        timezone : 'Asia/Tokyo',
        expect: null,
      },
      {
        date: null,
        timezone : 'Asia/Tokyo',
        expect: null,
      },
      {
        date: "2024-12-24T12:34:56Z",
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 24 , 12, 34, 56),
      },
      {
        date: "2024-12-24T12:34:56Z",
        timezone : 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 24 , 12, 34, 56),
      },
      {
        date: "2024-12-24T12:34:56Z",
        timezone : undefined,
        expect: toUtcDate(2024, 12, 24 , 12, 34, 56),
      },
      {
        date: "2024-12-24T12:34:56",
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 24 , 12, 34, 56),
      },
      {
        date: "2024-12-24T12:34:56",
        timezone : 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 24 , 12, 34, 56),
      },
      {
        date: "2024-12-24T12:34:56",
        timezone : undefined,
        expect: toUtcDate(2024, 12, 24 , 12, 34, 56),
      },
      { // invalid
        date: "12:23:45",
        timezone : 'America/Los_Angeles',
        expect: null,
      },
      { // invalid
        date: "12:23:45",
        timezone : undefined,
        expect: null,
      },
    ];
    tests.forEach((test) => {
      {
        const actual = toUTCDateFromString(
          test.date,
          test.timezone
        );
        expect(toUtcDateActual(actual)?.toISOString()).toBe(test.expect?.toISOString());
      }
    });
  });
});
