import { RegistrationMethod } from "~/src/compornents/const";
import { components } from "~/src/interfaces/root";

// 度数情報（JSON形式）
type PrescriptionRequest =
  components["schemas"]["ItemGroupRequestInfo"]["prescription"];
type PrescriptionAdditional = { prescriptionRegistDate?: string };
export type PrescriptionType = Omit<
  PrescriptionRequest & PrescriptionAdditional,
  "prescriptionData"
>;

/**
 * 度数情報
 */
export class Prescription {
  /* 処方箋情報 */
  private prescription: PrescriptionType | undefined;

  /**
   * コンストラクタ
   * @param prescription 処方箋情報JSON／カート登録・変更APIリクエストの処方箋情報
   */
  constructor(prescription?: string | PrescriptionRequest) {
    if (typeof prescription === "string") {
      this.prescription = JSON.parse(prescription);
    } else if (this.isPrescriptionRequest(prescription)) {
      // カート登録・変更APIリクエストの処方箋情報の場合、処方箋画像を削除
      this.prescription = this.fromPrescriptionRequest(prescription);
    } else {
      this.prescription = undefined;
    }
  }

  /**
   * PrescriptionRequest 判定(タイプガード)
   * @param source
   * @returns
   */
  private isPrescriptionRequest(
    source: object | undefined
  ): source is PrescriptionRequest {
    // "registrationMethodCode"があることを確認
    if (source != undefined) {
      return "registrationMethodCode" in source;
    }
    return false;
  }

  /**
   * PrescriptionRequest から PrescriptionTypeに変換
   * @param source
   * @returns
   */
  private fromPrescriptionRequest(
    source: PrescriptionRequest
  ) {
    const prescription: PrescriptionType = {
      prescriptionId: source?.prescriptionId,
      registrationMethodCode: source?.registrationMethodCode,
      prescriptionInfo: {
        vision: source?.prescriptionInfo?.vision,
        perspectiveTypeCode: source?.prescriptionInfo?.perspectiveTypeCode,
        eyepointRight: source?.prescriptionInfo?.eyepointRight,
        eyepointLeft: source?.prescriptionInfo?.eyepointLeft,
        pdRight: source?.prescriptionInfo?.pdRight,
        pdLeft: source?.prescriptionInfo?.pdLeft,
        sphRight: source?.prescriptionInfo?.sphRight,
        sphLeft: source?.prescriptionInfo?.sphLeft,
        cylRight: source?.prescriptionInfo?.cylRight,
        cylLeft: source?.prescriptionInfo?.cylLeft,
        axisRight: source?.prescriptionInfo?.axisRight,
        axisLeft: source?.prescriptionInfo?.axisLeft,
        addRight: source?.prescriptionInfo?.addRight,
        addLeft: source?.prescriptionInfo?.addLeft,
        prismFlag: source?.prescriptionInfo?.prismFlag,
        prism01Right: source?.prescriptionInfo?.prism01Right,
        prism01Left: source?.prescriptionInfo?.prism01Left,
        baseHRight: source?.prescriptionInfo?.baseHRight,
        baseHLeft: source?.prescriptionInfo?.baseHLeft,
        prism02Right: source?.prescriptionInfo?.prism02Right,
        prism02Left: source?.prescriptionInfo?.prism02Left,
        baseVRight: source?.prescriptionInfo?.baseVRight,
        baseVLeft: source?.prescriptionInfo?.baseVLeft,
      },
      // 処方箋期限 は個別書式で登録されるので関数を変える。
      prescriptionExpiration: source?.prescriptionExpiration,
    };
    return prescription;
  }

  /**
   * 処方箋ID設定
   * @param value
   */
  public setPrescriptionId(value: number | undefined) {
    if (this.prescription != undefined) {
      this.prescription.prescriptionId = value;
    }
  }

  /**
   * 遠中近区分取得
   * @returns 遠中近区分
   */
  public getPerspectiveTypeCode() {
    return this.prescription?.prescriptionInfo?.perspectiveTypeCode;
  }

  /**
   * アイポイント(R)取得
   * @returns
   */
  public getEyepointRight() {
    return this.prescription?.prescriptionInfo?.eyepointRight ?? undefined;
  }
  /**
   * アイポイント(L)取得
   * @returns
   */
  public getEyepointLeft() {
    return this.prescription?.prescriptionInfo?.eyepointLeft ?? undefined;
  }

  /**
   * PD(R)取得
   * @returns
   */
  public getPdRight() {
    return this.prescription?.prescriptionInfo?.pdRight;
  }

  /**
   * PD(L)取得
   * @returns
   */
  public getPdLeft() {
    return this.prescription?.prescriptionInfo?.pdLeft;
  }

  /**
   * SPH(R)取得
   * @returns
   */
  public getSphRight() {
    return this.prescription?.prescriptionInfo?.sphRight;
  }

  /**
   * SPH(L)取得
   * @returns
   */
  public getSphLeft() {
    return this.prescription?.prescriptionInfo?.sphLeft;
  }

  /**
   * CYL(R)取得
   * @returns
   */
  public getCylRight() {
    return this.prescription?.prescriptionInfo?.cylRight;
  }

  /**
   * CYL(L)取得
   * @returns
   */
  public getCylLeft() {
    return this.prescription?.prescriptionInfo?.cylLeft;
  }

  /**
   * 加入度数(R) 取得
   * @returns
   */
  public getAddRight() {
    return this.prescription?.prescriptionInfo?.addRight ?? undefined;
  }

  /**
   * 加入度数(R)設定
   * @param value
   */
  public setAddRight(value: number | undefined) {
    if (this.prescription?.prescriptionInfo != undefined) {
      this.prescription.prescriptionInfo.addRight = value;
    }
  }

  /**
   * 加入度数(L) 取得
   * @returns
   */
  public getAddLeft() {
    return this.prescription?.prescriptionInfo?.addLeft ?? undefined;
  }

  /**
   * 加入度数(L)設定
   * @param value
   */
  public setAddLeft(value: number | undefined) {
    if (this.prescription?.prescriptionInfo != undefined) {
      this.prescription.prescriptionInfo.addLeft = value;
    }
  }

  /**
   * 処方箋期限取得
   * @returns
   */
  public getPrescriptionExpiration() {
    return this.prescription?.prescriptionExpiration ?? undefined;
  }

  /**
   * 処方箋登録日取得
   * @returns
   */
  public getPrescriptionRegistDate() {
    return this.prescription?.prescriptionRegistDate;
  }

  /**
   * 処方箋登録日設定
   * @returns
   */
  public setPrescriptionRegistDate(value: string | undefined) {
    if (this.prescription != undefined) {
      this.prescription.prescriptionRegistDate = value;
    } else {
      const prescription: PrescriptionType = {
        prescriptionRegistDate: value,
      };
      this.prescription = prescription;
    }
  }

  /**
   * 処方箋情報が定義されているかどうか
   * @returns
   */
  public isDefined(): boolean {
    return this.prescription != undefined;
  }

  /**
   * JSON形式に変換
   * @returns
   */
  public toJSON(): string {
    return JSON.stringify(this.prescription);
  }

  /**
   * 処方箋による度数登録方法かを判定
   * @returns
   */
  public isPrescriptionMethodByPrescription(): boolean {
    // 処方箋が必要な度数登録方法
    return Prescription.isPrescriptionMethodByPrescription(
      this.prescription?.registrationMethodCode
    );
  }

  /**
   * 処方箋による度数登録方法かを判定(static)
   * @param registrationMethodCode 度数登録方法
   * @returns
   */
  public static isPrescriptionMethodByPrescription(
    registrationMethodCode: string | undefined | null
  ): boolean {
    // 処方箋が必要な度数登録方法
    const needPrescriptionMethodCodes: (string | undefined | null)[] = [
      RegistrationMethod.PRESCRIPTION.CODE,
    ];
    return needPrescriptionMethodCodes.includes(registrationMethodCode);
  }
}
