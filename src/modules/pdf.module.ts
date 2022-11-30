import { Module } from '@nestjs/common';
import { PdfService } from 'src/services/pdf.service';

@Module({
  imports: [],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
