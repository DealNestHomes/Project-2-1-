import { Client } from "minio";
import { env } from "./env";
import { getBaseUrl } from "./utils/base-url";

export const minioBaseUrl = getBaseUrl({ port: 9000 });

const url = new URL(minioBaseUrl);
export const minioClient = new Client({
  endPoint: url.hostname,
  port: parseInt(url.port) || (url.protocol === "https:" ? 443 : 80),
  useSSL: url.protocol === "https:",
  accessKey: "admin",
  secretKey: env.ADMIN_PASSWORD,
});
