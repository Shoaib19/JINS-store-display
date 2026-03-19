import { unmanaged } from "inversify/lib/inversify";

export const badRequest = {
  headers: new Headers(),
  url: "string",
  status: 400,
  statusText: "",
  data: 
    {
      "Jins-Trace-ID": "2389c607-f5ed-4789-95a3-efd78be1e8d9",
      "timestamp": "2024-09-30T23:26:25.536Z",
      "systemName": "DJ36-Sales",
      "code": "COM_0001",
      "message": "Validation error occurred.",
      "details": "The XXXX is required."
    },
};

export const tooManyRequests = {
  headers: new Headers(),
  url: "string",
  status: 429,
  statusText: "",
  data: 
    {
      "Jins-Trace-ID": "2389c607-f5ed-4789-95a3-efd78be1e8d9",
      "timestamp": "2024-09-30T23:26:25.536Z",
      "systemName": "DJ36-Sales",
      "code": "COM_0006",
      "message": "Too Many Requests.",
      "details": "Duplicate api invocation detected."
    },
};

export const internalServerError = {
  headers: new Headers(),
  url: "string",
  status: 500,
  statusText: "",
  data: 
    {
      "Jins-Trace-ID": "2389c607-f5ed-4789-95a3-efd78be1e8d9",
      "timestamp": "2024-09-30T23:26:25.536Z",
      "systemName": "DJ36-Sales",
      "code": "COM_0007",
      "message": "Internal Server Error.",
      "details": "Unexpected error occurred."
    },
};
