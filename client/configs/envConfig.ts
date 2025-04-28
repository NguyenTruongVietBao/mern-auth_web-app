import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_BACKEND_URL: z.string(),
    NEXT_PUBLIC_FRONTEND_URL: z.string(),
});

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
});

if (!configProject.success) {
    console.log(configProject.error);
    throw new Error(`Error when get env data`);
}

const envConfig = configProject.data;

export default envConfig;
