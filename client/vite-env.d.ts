/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AXIOS_BASE_URL: string;
    // Add other environment variables here if you have more
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
