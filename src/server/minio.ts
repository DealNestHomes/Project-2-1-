import { Client } from "minio";
import { env } from "./env";
import { getBaseUrl } from "./utils/base-url";

// This is used for generating download links in the frontend and emails.
// We've switched to Supabase Storage, so this returns the Supabase public URL base.
export const minioBaseUrl = `${env.SUPABASE_URL}/storage/v1/object/public`;

let clientValue: Client | undefined;

/**
 * @deprecated Switching to Supabase Storage. This is only kept for backward compatibility in scripts.
 */
export const getMinioClient = () => {
    if (clientValue) return clientValue;

    // Internal local URL for MinIO, used only for legacy setup scripts
    const localMinioUrl = getBaseUrl({ port: 9000 });
    const url = new URL(localMinioUrl);

    clientValue = new Client({
        endPoint: url.hostname,
        port: parseInt(url.port) || (url.protocol === "https:" ? 443 : 80),
        useSSL: url.protocol === "https:",
        accessKey: "admin",
        secretKey: env.ADMIN_PASSWORD,
    });
    return clientValue;
};
