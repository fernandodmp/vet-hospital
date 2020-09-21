import { Module } from '@nestjs/common';
import { DoctorsModule } from './doctors/doctors.module';
@Module({
  imports: [DoctorsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
