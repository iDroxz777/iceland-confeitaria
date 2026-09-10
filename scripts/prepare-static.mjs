import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const webBuild = fileURLToPath(new URL('../apps/web/dist/', import.meta.url));
const staticBuild = fileURLToPath(new URL('../dist/', import.meta.url));

await rm(staticBuild, { recursive: true, force: true });
await mkdir(staticBuild, { recursive: true });
await cp(webBuild, staticBuild, { recursive: true });

console.log(`Frontend preparado em ${staticBuild.replace(projectRoot, '')}`);
