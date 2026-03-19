import { ReceptionEvent, ReceptionEventsGetResponse } from "~/src/clients/carts/cartsClientTypes";
import { StaffGetResponse } from "~/src/clients/staffs/staffsClientTypes";

const 受付履歴_チェックイン : ReceptionEvent = {
    rowid: 1,
    receptionNumber: "240115US000001",
    itemGroupCode: "240115US000001-1",
    eventCode: "000",
    storeCode: "84403",
    // "jinsAccountId": null,
    registeredUserId: "guest",
    registeredProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    registeredDatetime: "2024-10-15T10:00:00",
    updatedUserId: "guest",
    updatedProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    updatedDatetime: "2024-10-15T10:00:00",
    optimisticLockVerNo: 1,
    staffName: "STAFF_NAME",
}

const 受付履歴_度数登録_staff001 : ReceptionEvent = {
    rowid: 1,
    receptionNumber: "240115US000001",
    itemGroupCode: "240115US000001-1",
    eventCode: "100",
    storeCode: "84403",
    // "jinsAccountId": null,
    registeredUserId: "staff001",
    registeredProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    registeredDatetime: "2024-10-15T10:10:00",
    updatedUserId: "staff001",
    updatedProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    updatedDatetime: "2024-10-15T10:10:00",
    optimisticLockVerNo: 1,
    staffName: "STAFF_NAME",
}

const 受付履歴_フレーム_staff002 : ReceptionEvent = {
    rowid: 1,
    receptionNumber: "240115US000001",
    itemGroupCode: "240115US000001-1",
    eventCode: "200",
    storeCode: "84403",
    // "jinsAccountId": null,
    registeredUserId: "staff002",
    registeredProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    registeredDatetime: "2024-10-15T10:30:00",
    updatedUserId: "staff002",
    updatedProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    updatedDatetime: "2024-10-15T10:30:00",
    optimisticLockVerNo: 1,
    staffName: "STAFF_NAME",
}

const 受付履歴_ケース_staff002 : ReceptionEvent = {
    rowid: 1,
    receptionNumber: "240115US000001",
    itemGroupCode: "240115US000001-1",
    eventCode: "400",
    storeCode: "84403",
    // "jinsAccountId": null,
    registeredUserId: "staff002",
    registeredProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    registeredDatetime: "2024-10-15T10:35:00",
    updatedUserId: "staff002",
    updatedProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    updatedDatetime: "2024-10-15T10:35:00",
    optimisticLockVerNo: 1,
    staffName: "STAFF_NAME",
}

const 受付履歴_ケース_staff003 : ReceptionEvent = {
  rowid: 1,
  receptionNumber: "240115US000001",
  itemGroupCode: "240115US000001-1",
  eventCode: "400",
  storeCode: "84403",
  // "jinsAccountId": null,
  registeredUserId: "staff003",
  registeredProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  registeredDatetime: "2024-10-15T10:35:00",
  updatedUserId: "staff003",
  updatedProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  updatedDatetime: "2024-10-15T10:35:00",
  optimisticLockVerNo: 1,
  staffName: "STAFF_NAME",
}
const 受付履歴_ケース_staff004 : ReceptionEvent = {
    rowid: 1,
    receptionNumber: "240115US000001",
    itemGroupCode: "240115US000001-1",
    eventCode: "400",
    storeCode: "84403",
    // "jinsAccountId": null,
    registeredUserId: "staff004",
    registeredProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    registeredDatetime: undefined,
    updatedUserId: "staff004",
    updatedProgram: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    updatedDatetime: "2024-10-15T10:35:00",
    optimisticLockVerNo: 1,
    staffName: null,
}

export const 受付履歴取得: Readonly<ReceptionEventsGetResponse> = {
  rcptEvent: [
    受付履歴_チェックイン,
    受付履歴_度数登録_staff001,
    受付履歴_フレーム_staff002,
    受付履歴_ケース_staff002,
    受付履歴_ケース_staff003,
    受付履歴_ケース_staff004
  ],
};

export const 受付履歴取得_0件: Readonly<ReceptionEventsGetResponse> = {
    rcptEvent: [
    ],
  };
  
export const スタッフ情報取得_JonStaff: Readonly<StaffGetResponse> = {
  staffId: "JINS12345",
  staffName: "Jon Staff",
};

export const スタッフ情報取得_staff001: Readonly<StaffGetResponse> = {
    staffId: "staff001",
    staffName: "Staff1",
  };
    
  export const スタッフ情報取得_staff002: Readonly<StaffGetResponse> = {
    staffId: "staff002",
    staffName: "Staff2",
  };
    