import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GearController } from './gears/gear/gear.controller';
import { GearService } from './gears/gear/gear.service';

@Module({
  imports: [],
  controllers: [AppController, GearController],
  providers: [AppService, GearService],
})
export class AppModule { }
