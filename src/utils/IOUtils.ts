import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';

export const save = async (path: string, data: any) => {
  const writeFile = util.promisify(fs.writeFile);
  try {
    await writeFile(path, JSON.stringify(data));
  } catch (error) {
    throw new InternalServerErrorException();
  }
};

const IOUtils = { save };

export default IOUtils;
