import { Client } from "minio";
import { env } from "./env";
import { getBaseUrl } from "./utils/base-url";

export const minioBaseUrl = getBaseUrl({ port: 9000 });

let clientValue: Client | undefined;

export const getMinioClient = () => {
    if (clientValue) return clientValue;

    const url = new URL(minioBaseUrl);
    clientValue = new Client({
        endPoint: url.hostname,
        port: parseInt(url.port) || (url.protocol === "https:" ? 443 : 80),
        useSSL: url.protocol === "https:",
        accessKey: "admin",
        secretKey: env.ADMIN_PASSWORD,
    });
    return clientValue;
};
