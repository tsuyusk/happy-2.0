import { join } from 'path';
import { diskStorage } from 'multer';

const tmpFolder = join(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  storage: diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileName = `${Date.now()}-${file.originalname}`;

      callback(null, fileName);
    },
  }),
};
