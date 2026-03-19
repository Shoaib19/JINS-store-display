import "reflect-metadata";
import { ReceptionsPresenter } from "~/src/presenters/receptions/ReceptionsPresenter";
import { logger } from "~/src/logging/logger";
import { sendApiRequest } from "~/src/utils/fetchService";
import { parseISO, differenceInMinutes } from "date-fns";

jest.mock("~/src/logging/logger");
jest.mock("~/src/utils/fetchService");
jest.mock("~/src/clients/receptions/receptionsClient", () => ({
  getReceptionsServer: jest.fn(),
}));
jest.mock("~/src/clients/callManagement/callManagementClient", () => ({
  getCallManagement: jest.fn(),
}));

describe("ReceptionsPresenter", () => {
  let presenter: ReceptionsPresenter;

  beforeEach(() => {
    jest.clearAllMocks();
    presenter = new ReceptionsPresenter();
  });

  test("show() should return valid RcptInfoResponse when both API calls succeed", async () => {
    (sendApiRequest as jest.Mock)
      .mockImplementationOnce(() => ({
        ok: true,
        data: {
          receptionInfos: [
            {
              registeredDate: "2025-05-29",
              visitingPurposeCode: "010",
              customerIssueCode: "001",
              prescriptionRegistCode: "001",
              callingNumber: "A1",
              receptionNumber: "250114US00001",
              statusCode: "100",
              callingStatusCode: "090",
              countryCodeAlpha2: "US",
              storeId: "1143416",
              customerName: "John Doe",
              phoneNumber: "07012345678",
              jinsAccountId: null,
              updatedDatetime: "2025-05-29T06:24:36.667781",
            },
            {
              registeredDate: "2025-05-29",
              visitingPurposeCode: "010",
              customerIssueCode: "001",
              prescriptionRegistCode: "001",
              callingNumber: "P1",
              receptionNumber: "250114US00001",
              statusCode: "200",
              callingStatusCode: "090",
              countryCodeAlpha2: "US",
              storeId: "1143416",
              customerName: "John Doe",
              phoneNumber: "07012345678",
              jinsAccountId: null,
              updatedDatetime: "2025-05-29T06:24:36.667781",
            },
          ],
        },
      }))
      .mockImplementationOnce(() => ({
        ok: true,
        data: {
          callManagementInfo: {
            availableLines: 2,
            timeRequiredUntilCall: 5,
            receptionCloseTime: "18:00:00",
          },
        },
      }));

    const result = await presenter.show("store001", "R123");

    expect(sendApiRequest).toHaveBeenCalledTimes(2);
    expect(result).toBeDefined();

    if (!("waitTimeRange" in result)) {
      throw new Error("Expected result to contain waitTimeRange");
    }

    expect(result.waitTimeRange).toBeDefined();
    expect(result.waitTimeRange!.earliest).toBeGreaterThanOrEqual(0);
    expect(result.waitPeople).toBeGreaterThanOrEqual(0);
    expect(result.callTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

    const parsedCallTime = parseISO(result.callTime!);
    const now = new Date();
    expect(differenceInMinutes(parsedCallTime, now)).toBeGreaterThanOrEqual(0);
  });

  test("show() should throw an error if receptions API response is not ok", async () => {
    (sendApiRequest as jest.Mock).mockImplementationOnce(() => ({
      ok: false,
      status: 500,
      message: "Server error",
    }));

    await expect(presenter.show("store001", "R123")).rejects.toMatchObject({
      ok: false,
      status: 500,
    });
    expect(sendApiRequest).toHaveBeenCalledTimes(1);
  });

  test("show() should throw an error if callManagement API response is not ok", async () => {
    (sendApiRequest as jest.Mock)
      .mockImplementationOnce(() => ({
        ok: true,
        data: { receptionInfos: [] },
      }))
      .mockImplementationOnce(() => ({
        ok: false,
        status: 400,
        message: "Bad request",
      }));

    await expect(presenter.show("store001")).rejects.toMatchObject({
      ok: false,
      status: 400,
    });
    expect(sendApiRequest).toHaveBeenCalledTimes(2);
  });

  test("show() should handle empty receptionInfos gracefully", async () => {
    (sendApiRequest as jest.Mock)
      .mockImplementationOnce(() => ({
        ok: true,
        data: { receptionInfos: [] },
      }))
      .mockImplementationOnce(() => ({
        ok: true,
        data: {
          callManagementInfo: {
            availableLines: 1,
            timeRequiredUntilCall: 5,
            receptionCloseTime: "18:00:00",
          },
        },
      }));

    const result = await presenter.show("store001");

    if (!("waitTimeRange" in result)) {
      throw new Error("Expected result to contain waitTimeRange");
    }

    expect(result.waitPeople).toBe(0);
    expect(result.waitTimeRange).toBeDefined();
    expect(result.waitTimeRange!.earliest).toBe(0);
    expect(result.waitTimeRange!.latest).toBeGreaterThanOrEqual(0);
    expect(typeof result.isReceptionClose).toBe("boolean");
  });

  test("show() logs and rethrows errors", async () => {
    const mockError = new Error("Unexpected Error");
    (sendApiRequest as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await expect(presenter.show("store001")).rejects.toThrow(
      "Unexpected Error",
    );
    expect(logger.error).toHaveBeenCalled();
  });
});
