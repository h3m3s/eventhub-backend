import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './@Events/events.module';
@Module({
  imports: [
     TypeOrmModule.forRoot({
     type: 'mysql',
     host: 'localhost',
     port: 3306,
     username: 'root',
     password: '',
     database: 'eventhub',
     entities: [__dirname + '/**/*.entities{.ts,.js}'],
     autoLoadEntities: true,
    }),
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
