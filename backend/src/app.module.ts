import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { LocationsModule } from './locations/locations.module';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    LocationsModule,
    StocksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
