import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // фиксируем корень проекта, чтобы Turbopack не «поднимался» к чужому lock-файлу выше по дереву
  turbopack: { root },
};
export default nextConfig;
