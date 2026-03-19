import { format } from "date-fns";
import { getStartOfDate, getStartOfToday, getTimeOfToday, getWarrantyExpirationDate, roundUpToNextMinute } from "~/src/utils/datetimeUtils";

describe("datetimeUtils", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  const toUtcDate = (
    utcYear: number,
    utcMonth: number,
    utcDate: number,
    utcHour: number,
    utcMinutes: number,
    utcSeconds: number,
    utcMilliseconds?: number
  ) =>
    new Date(
      Date.UTC(
        utcYear,
        utcMonth - 1,
        utcDate,
        utcHour,
        utcMinutes,
        utcSeconds,
        // utcMilliseconds
      )
    );

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

  test("roundUpToNextMinute", async () => {
    interface TestCase {
      date: Date;
      expect: Date;
    }
    const tests: TestCase[] = [
      {
        date: toUtcDate(2024, 12, 24, 15, 20, 30, 1),
        expect: toUtcDate(2024, 12, 24, 15, 21, 0, 0),
      },
      {
        date: toUtcDate(2024, 12, 24, 15, 20, 0, 15),
        expect: toUtcDate(2024, 12, 24, 15, 20, 0, 0),
      },
    ];
    tests.forEach((test) => {
      {
        const actual = roundUpToNextMinute(test.date);
        expect(actual.toISOString()).toBe(test.expect.toISOString());
      }
    });
  });


  test("getTimeOfToday", async () => {
    interface TestCase {
      now: Date;
      time?: string | null;
      timezone: string;
      expect: Date | null;
    }
    const tests: TestCase[] = [
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        time: "20:00:00",
        timezone: 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 25, 4, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 7, 59, 59),
        time: "20:00:00",
        timezone: 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 24, 4, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 8, 0, 0),
        time: "20:00:00",
        timezone: 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 25, 4, 0, 0),
      },
      {
        now: toUtcDate(2024, 5, 24, 6, 59, 59),
        time: "20:00:00",
        timezone: 'America/Los_Angeles',
        expect: toUtcDate(2024, 5, 24, 3, 0, 0),
      },
      {
        now: toUtcDate(2024, 5, 24, 7, 0, 0),
        time: "20:00:00",
        timezone: 'America/Los_Angeles',
        expect: toUtcDate(2024, 5, 25, 3, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        time: "20:00:00",
        timezone: '-06:00',
        expect: toUtcDate(2024, 12, 25, 2, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 5, 59, 59),
        time: "20:00:00",
        timezone: '-06:00',
        expect: toUtcDate(2024, 12, 24, 2, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 6, 0, 0),
        time: "20:00:00",
        timezone: '-06:00',
        expect: toUtcDate(2024, 12, 25, 2, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        time: "20:00:00",
        timezone: 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 24, 11, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 14, 59, 59),
        time: "20:00:00",
        timezone: 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 24, 11, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 15, 0, 0),
        time: "20:00:00",
        timezone: 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 25, 11, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 5, 59, 59),
        time: null,
        timezone: 'America/Los_Angeles',
        expect: null,
      },
      {
        now: toUtcDate(2024, 12, 24, 5, 59, 59),
        time: undefined,
        timezone: 'America/Los_Angeles',
        expect: null,
      },
    ];
    tests.forEach((test) => {
      jest.setSystemTime(test.now);
      const actual = getTimeOfToday(
        test.time,
        test.timezone
      );
      expect(toUtcDateActual(actual)?.toISOString()).toBe(test.expect?.toISOString());
    });
  });

  test("getStartOfToday", async () => {
    interface TestCase {
      now: Date;
      timezone: string;
      expect: Date | null;
    }
    const tests: TestCase[] = [
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: "America/Los_Angeles",
        expect: toUtcDate(2024, 12, 24, 8, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 7, 59, 59),
        timezone: "America/Los_Angeles",
        expect: toUtcDate(2024, 12, 23, 8, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 8, 0, 0),
        timezone: "America/Los_Angeles",
        expect: toUtcDate(2024, 12, 24, 8, 0, 0),
      },
      {
        now: toUtcDate(2024, 5, 24, 12, 34, 56),
        timezone: "America/Los_Angeles",
        expect: toUtcDate(2024, 5, 24, 7, 0, 0),
      },
      {
        now: toUtcDate(2024, 5, 24, 6, 59, 59),
        timezone: "America/Los_Angeles",
        expect: toUtcDate(2024, 5, 23, 7, 0, 0),
      },
      {
        now: toUtcDate(2024, 5, 24, 7, 0, 0),
        timezone: "America/Los_Angeles",
        expect: toUtcDate(2024, 5, 24, 7, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: "-06:00", // CST
        expect: toUtcDate(2024, 12, 24, 6, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 5, 59, 59),
        timezone: "-06:00", // CST
        expect: toUtcDate(2024, 12, 23, 6, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 6, 0, 0),
        timezone: "-06:00", // CST
        expect: toUtcDate(2024, 12, 24, 6, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone: 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 23, 15, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 14, 59, 59),
        timezone: 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 23, 15, 0, 0),
      },
      {
        now: toUtcDate(2024, 12, 24, 15, 0, 0),
        timezone: 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 24, 15, 0, 0),
      },
      {
        now: toUtcDate(2024, 5, 24, 7, 59, 59),
        timezone: "-0800",
        expect: toUtcDate(2024, 5, 23, 8, 0, 0),
      },
    ];
    tests.forEach((test) => {
      jest.setSystemTime(test.now);
      const actual = getStartOfToday(
        test.timezone
      );
      // expect(actual).toEqual (test.expect);
      expect(toUtcDateActual(actual)?.toISOString()).toBe(test.expect?.toISOString());
    });
  });

  test("getStartOfDate", async () => {
    interface TestCase {
      date: Date | null | undefined;
      timezone: string;
      expect: Date | null;
    }
    const tests: TestCase[] = [
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 24, 8, 0, 0),
      },
      {
        date: toUtcDate(2024, 12, 24, 8, 0, 0),
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 12, 24, 8, 0, 0),
      },
      {
        date: toUtcDate(2024, 5, 24, 12, 34, 56),
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 5, 24, 7, 0, 0),
      },
      {
        date: toUtcDate(2024, 5, 24, 7, 0, 0),
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 5, 24, 7, 0, 0),
      },
      {
        date: toUtcDate(2024, 5, 24, 6, 59, 59),
        timezone : 'America/Los_Angeles',
        expect: toUtcDate(2024, 5, 23, 7, 0, 0),
      },
      {
        date: toUtcDate(2024, 12, 24, 6, 0, 0),
        timezone : '-06:00',
        expect: toUtcDate(2024, 12, 24, 6, 0, 0),
      },
      {
        date: toUtcDate(2024, 12, 24, 5, 59, 59),
        timezone : '-06:00',
        expect: toUtcDate(2024, 12, 23, 6, 0, 0),
      },
      {
        date: toUtcDate(2024, 12, 23, 15, 0, 0),
        timezone : 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 23, 15, 0, 0),
      },
      {
        date: toUtcDate(2024, 12, 23, 14, 59, 59),
        timezone : 'Asia/Tokyo',
        expect: toUtcDate(2024, 12, 22, 15, 0, 0),
      },
      {
        date: toUtcDate(2024, 12, 24, 12, 34, 56),
        timezone : 'UTC',
        expect: toUtcDate(2024, 12, 24, 0, 0, 0),
      },
      {
        date: undefined,
        timezone : 'America/Los_Angeles',
        expect: null,
      },
      {
        date: null,
        timezone : 'America/Los_Angeles',
        expect: null,
      },

      // {
      //   date: '2024-12-24',
      //   timezone : 'America/Los_Angeles',
      //   expect: toUtcDate(2024, 12, 24, 8, 0, 0),
      // },
      // {
      //   date: '2024-05-24',
      //   timezone : 'America/Los_Angeles',
      //   expect: toUtcDate(2024, 5, 24, 7, 0, 0),
      // },
      // {
      //   date: '2024-12-24',
      //   timezone : '-06:00',
      //   expect: toUtcDate(2024, 12, 24, 6, 0, 0),
      // },
      // {
      //   date: '2024-12-24',
      //   timezone : 'Asia/Tokyo',
      //   expect: toUtcDate(2024, 12, 23, 15, 0, 0),
      // },
      // {
      //   date: '2024-12-24',
      //   timezone : 'UTC',
      //   expect: toUtcDate(2024, 12, 24, 0, 0, 0),
      // },
      // {
      //   date: undefined,
      //   timezone : 'America/Los_Angeles',
      //   expect: null,
      // },
      // {
      //   date: null,
      //   timezone : 'America/Los_Angeles',
      //   expect: null,
      // },
    ];
    tests.forEach((test) => {
      const actual = getStartOfDate(
        test.date,
        test.timezone
      );
      expect(toUtcDateActual(actual)?.toISOString()).toBe(test.expect?.toISOString());
    });
  });

  test("getWarrantyExpirationDate", async () => {
    interface TestCase {
      start?: Date | null;
      timeZone? : string;
      expect: any;
    }
    const tests: TestCase[] = [
      {
        start: null,
        expect: undefined,
      },
      {
        start: undefined,
        expect: undefined,
      },
      {
        start: toUtcDate(2024, 12, 24, 0, 0, 0, 0),
        expect: toUtcDate(2025, 12, 24, 0, 0, 0, 0),
        // expect: "2025-12-24",
      },
      {
        start: toUtcDate(2024, 12, 31, 0, 0, 0, 0),
        expect: toUtcDate(2025, 12, 31, 0, 0, 0, 0),
        // expect: "2025-12-31",
      },
      {
        start: toUtcDate(2024, 2, 28, 0, 0, 0, 0),
        expect: toUtcDate(2025, 2, 28, 0, 0, 0, 0),
        // expect: "2025-02-28",
      },
      {
        start: toUtcDate(2024, 2, 29, 0, 0, 0, 0),
        expect: toUtcDate(2025, 2, 28, 0, 0, 0, 0),
        // expect: "2025-02-28",
      },
      {
        start: toUtcDate(2024, 3, 1, 0, 0, 0, 0),
        expect: toUtcDate(2025, 3, 1, 0, 0, 0, 0),
        // expect: "2025-03-01",
      },


      {
        start: toUtcDate(2024, 12, 24, 8, 0, 0, 0),
        timeZone: 'America/Los_Angeles',
        expect: toUtcDate(2025, 12, 24, 8, 0, 0, 0),
        // expect: "2025-12-24",
      },
      {
        start: toUtcDate(2024, 12, 31, 8, 0, 0, 0),
        timeZone: 'America/Los_Angeles',
        expect: toUtcDate(2025, 12, 31, 8, 0, 0, 0),
        // expect: "2025-12-31",
      },
      {
        start: toUtcDate(2024, 2, 28, 8, 0, 0, 0),
        timeZone: 'America/Los_Angeles',
        expect: toUtcDate(2025, 2, 28, 8, 0, 0, 0),
        // expect: "2025-02-28",
      },
      {
        start: toUtcDate(2024, 2, 29, 8, 0, 0, 0),
        timeZone: 'America/Los_Angeles',
        expect: toUtcDate(2025, 2, 28, 8, 0, 0, 0),
        // expect: "2025-02-28",
      },
      {
        start: toUtcDate(2024, 3, 1, 8, 0, 0, 0),
        timeZone: 'America/Los_Angeles',
        expect: toUtcDate(2025, 3, 1, 8, 0, 0, 0),
        // expect: "2025-03-01",
      },

      // {
      //   start: "2024-12-24",
      //   expect: toUtcDate(2025, 12, 24, 0, 0, 0, 0),
      //   // expect: "2025-12-24",
      // },
      // {
      //   start: "2024-12-31",
      //   expect: toUtcDate(2025, 12, 31, 0, 0, 0, 0),
      //   // expect: "2025-12-31",
      // },
      // {
      //   start: "2024-02-28",
      //   expect: toUtcDate(2025, 2, 28, 0, 0, 0, 0),
      //   // expect: "2025-02-28",
      // },
      // {
      //   start: "2024-02-29",
      //   expect: toUtcDate(2025, 2, 28, 0, 0, 0, 0),
      //   // expect: "2025-02-28",
      // },
      // {
      //   start: "2024-03-01",
      //   expect: toUtcDate(2025, 3, 1, 0, 0, 0, 0),
      //   // expect: "2025-03-01",
      // },
    ];
    tests.forEach((test) => {
      {
        const actual = getWarrantyExpirationDate(test.start, test.timeZone);
        // expect(actual).toBe(test.expect);
        expect(toUtcDateActual(actual)?.toISOString()).toBe(test.expect?.toISOString());
      }
    });
  });
});
