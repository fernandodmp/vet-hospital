import { Module } from '@nestjs/common';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
@Module({
  imports: [DoctorsModule, AppointmentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
