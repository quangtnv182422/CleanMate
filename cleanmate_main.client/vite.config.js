import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "cleanmate_main.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7082';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        outDir: '../CleanMate_Main.Server/wwwroot', // Xuất file build vào wwwroot của backend
        emptyOutDir: true, // Xóa nội dung thư mục đích trước khi build
        assetsDir: 'assets', // Thư mục cho các file tĩnh (JS, CSS, hình ảnh)
    },
    server: {
        proxy: {
            '^/Authen': { 
                target,
                secure: false
            },
            '^/cleanservice': {
                target,
                secure: false
            },
            '^/worklist': {
                target,
                secure: false
            },
            '^/bookingstatus': {
                target,
                secure: false
            },
            '^/address': {
                target,
                secure: false
            },
            '^/payments': {
                target,
                secure: false
            },
            '^/work': {
                target,
                secure: false
            },
            '^/request': {
                target,
                secure: false
            },
            '^/withdrawrequest': {
                target,
                secure: false
            },
            '^/wallet': {
                target,
                secure: false
            },
            '^/bookings': {
                target,
                secure: false
            },
            '^/feedback': {
                target,
                secure: false
            },
            '^/earning': {
                target,
                secure: false
            },
            '^/managebooking': {
                target,
                secure: false
            }
            ,
            '^/cleanperhour': {
                target,
                secure: false
            }
        },
        port: parseInt(env.DEV_SERVER_PORT || '60391'),
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
