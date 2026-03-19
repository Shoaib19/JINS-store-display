import { components } from "~/src/interfaces/clients/bffValidators/bffValidatorsClient";

// 度数組合せチェックAPI
type PostEyesightCombiBody = components["schemas"]["EyesightCombiPostRequest"];
export type EyesightCombiPostRequest = PostEyesightCombiBody;
export type EyesightCombiPostResponse = components["schemas"]["EyesightCombiPostResponse"];

// アイポイント測定チェックAPI
type PostEyepointMeasureBody = components["schemas"]["EyepointMeasurePostRequest"];
export type EyepointMeasurePostRequest = PostEyepointMeasureBody;
export type EyepointMeasurePostResponse = components["schemas"]["EyepointMeasurePostResponse"];
