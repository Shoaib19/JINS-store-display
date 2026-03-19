import tracer from "dd-trace";

tracer.init({
  env: process.env.ENVIRONMENT,
  service: "JINS-Hub-BFF", // サービス名
  version: "1.0.0", // アプリケーションのバージョン
  logInjection: true,
});

export default tracer;
