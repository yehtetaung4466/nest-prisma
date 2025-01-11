import { Readable } from "stream";
import {Multer} from 'multer'

export default class MultipartFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  constructor({
    fieldname,
    originalname,
    encoding,
    mimetype,
    size,
    buffer,
  }: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }) {
    this.fieldname = fieldname;
    this.originalname = originalname;
    this.encoding = encoding;
    this.mimetype = mimetype;
    this.size = size;
    this.buffer = buffer;
  }
}
