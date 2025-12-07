import { Module } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MedicalRecord, MedicalRecordSchema } from './schemas/medical-record.schema/medical-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MedicalRecord.name, schema: MedicalRecordSchema }]),
    AuthModule, 
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
