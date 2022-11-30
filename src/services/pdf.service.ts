import { Injectable } from '@nestjs/common';
import { join } from 'path';
import ejs from 'ejs';
import pdf from 'html-pdf';

@Injectable()
export class PdfService {
  async generate(templatePath: string, data: any) {
    const html: string = await ejs.renderFile(join(process.cwd(), templatePath), {
      ...data
    });

    let options = { format: 'A4', border: '1cm' };

    const _buffer = await new Promise<Buffer>((resolve, reject) =>
      pdf.create(html, options).toBuffer((err, buffer) => {
        if (err) return reject(err);
        return resolve(buffer);
      }),
    );

    return _buffer;
  }
}