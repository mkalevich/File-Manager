import path from "node:path";
import { promisify } from "util";
import fs from "fs";
import { FILE_NAME_FILED, FILE_TYPES } from "./constants.js";

const stat = promisify(fs.stat);

export const getPreparedTableFiles = async (files, cwd) => {
  const preparedFiles = files.map(async (file) => {
    const fileFullPath = path.join(cwd, file);
    const stats = await stat(fileFullPath);
    const fileType = stats.isDirectory()
      ? FILE_TYPES.DIRECTORY
      : FILE_TYPES.FILE;

    return { Name: file, Type: fileType };
  });

  return await Promise.all(preparedFiles);
};

export const sortFiles = (allFiles) => {
  const directories = filterFilesByType(allFiles, FILE_TYPES.DIRECTORY);
  const sortedDirectories = sortFilesByField(directories, FILE_NAME_FILED);

  const files = filterFilesByType(allFiles, FILE_TYPES.FILE);
  const sortedFiles = sortFilesByField(files, FILE_NAME_FILED);

  return [...sortedDirectories, ...sortedFiles];
};

const filterFilesByType = (files, type) =>
  files.filter((file) => file.Type === type);

const sortFilesByField = (files, field) =>
  files.sort((a, b) => a[field].localeCompare(b[field]));
