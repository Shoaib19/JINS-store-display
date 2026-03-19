export const getPrescriptionServerResponse = {
  "test": {
    "hoge1": "hoge1",
    "hoge2": "hoge2",
    "hoge3": "hoge3",
  },
  "data": "data:image/jpeg;base64,/9j/aaaaaaaaaaaaaaaaaaa",
};
export const getPrescriptionServerResponse_nodata = {
  "test": {
    "hoge1": "hoge1",
    "hoge2": "hoge2",
    "hoge3": "hoge3",
  },
  "data": undefined,
};
export const getPrescriptionServerResponse_nulldata = {
  "test": {
    "hoge1": "hoge1",
    "hoge2": "hoge2",
    "hoge3": "hoge3",
  },
  "data": null,
};
export const getPrescriptionServerResponse_undefined = undefined;
export const getPrescriptionServerResponse_null = null;

export const expectedJson_normal = {
  "test": {
    "hoge1": "hoge1",
    "hoge2": "hoge2",
    "hoge3": "hoge3",
  },
  "data": "data:image/jpeg;base64,/9j/aaaaaaaaaaaaaaaaaaa",
};
export const expectedJson_data_null = {
  "test": {
    "hoge1": "hoge1",
    "hoge2": "hoge2",
    "hoge3": "hoge3",
  },
  "data": null,
};
export const expectedJson_data_undefined = {
  "test": {
    "hoge1": "hoge1",
    "hoge2": "hoge2",
    "hoge3": "hoge3",
  },
};