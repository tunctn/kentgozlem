import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

export const resolveEnvs = () => {
  const upFolderSyntax = "../";
  const folderDepth = 10;
  const dir = __dirname;

  const checkedFilePaths: string[] = [];
  const foundFilePaths: string[] = [];

  let found = false;
  for (let i = 0; i < folderDepth; i++) {
    const createUpFolderSyntax = upFolderSyntax.repeat(i);
    const folderPath = path.resolve(dir, createUpFolderSyntax);
    const nodeEnv = process.env["NODE_ENV"];

    const baseEnvPath = path.resolve(folderPath, ".env");
    const localEnvPath = path.resolve(folderPath, `.env.local`);
    const nodeEnvPath = path.resolve(folderPath, `.env.${nodeEnv}`);

    if (fs.existsSync(baseEnvPath)) {
      dotenv.config({ path: baseEnvPath });
      found = true;
      foundFilePaths.push(baseEnvPath);
    }
		if (fs.existsSync(localEnvPath)) {
      dotenv.config({ path: localEnvPath });
			found = true;
			foundFilePaths.push(localEnvPath);
		}
    if (fs.existsSync(nodeEnvPath)) {
      dotenv.config({ path: nodeEnvPath });
      found = true;
      foundFilePaths.push(nodeEnvPath);
    }

    checkedFilePaths.push(baseEnvPath);
    checkedFilePaths.push(localEnvPath);
    checkedFilePaths.push(nodeEnvPath);
  }

  if (found === false) {
    console.error(
      "Failed to resolve envs. There is no .env file in the project.",
      { checked_file_paths: checkedFilePaths },
    );
  }
};

resolveEnvs();

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const DATABASE_URL = process.env.DATABASE_URL as string;
const NODE_ENV = process.env.NODE_ENV as "development" | "production" | "test";

const env = {
  MAPBOX_ACCESS_TOKEN,
  DATABASE_URL,
	NODE_ENV: NODE_ENV ?? 'development',
};

// check if all env variables are set
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`${key} is not set`);
  }
});

export default env;
