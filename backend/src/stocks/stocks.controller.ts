import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import type { AdjustStockDto } from './dto/adjust-stock.dto';
import { AdjustStockSchema } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('stocks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.stocksService.findAll(page, limit);
  }

  @Get('product/:productId')
  @Roles('ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  findByProduct(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.stocksService.findByProduct(productId);
  }

  @Get('location/:locationId')
  @Roles('ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  findByLocation(@Param('locationId', new ParseUUIDPipe()) locationId: string) {
    return this.stocksService.findByLocation(locationId);
  }

  @Post('adjust')
  @Roles('ADMIN', 'MANAGER', 'STAFF') // depending on your business rules, staff might be able to adjust
  adjust(
    @Request() req: AuthenticatedRequest,
    @Body(new ZodValidationPipe(AdjustStockSchema))
    adjustStockDto: AdjustStockDto,
  ) {
    const userId = req.user.id ?? req.user.sub;
    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.stocksService.adjustStock(userId, adjustStockDto);
  }
}
