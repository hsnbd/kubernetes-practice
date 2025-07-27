import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  Request,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
  OrderFilterDto,
  RefundOrderDto,
} from './dto/order.dto';

// JWT Guard placeholder - you'd implement this based on your auth strategy
// @UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id || createOrderDto.userId;
    const order = await this.ordersService.create(createOrderDto, userId);
    
    return {
      status: 'success',
      message: 'Order created successfully',
      data: order,
    };
  }

  @Get()
  async findAll(
    @Query(ValidationPipe) filterDto: OrderFilterDto,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id;
    const result = await this.ordersService.findAll(filterDto, userId);
    
    return {
      status: 'success',
      message: 'Orders retrieved successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id;
    const order = await this.ordersService.findOne(id, userId);
    
    return {
      status: 'success',
      message: 'Order retrieved successfully',
      data: order,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateOrderDto: UpdateOrderDto,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id;
    const order = await this.ordersService.update(id, updateOrderDto, userId);
    
    return {
      status: 'success',
      message: 'Order updated successfully',
      data: order,
    };
  }

  @Delete(':id')
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('reason') reason?: string,
    @Request() req?: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id;
    const order = await this.ordersService.cancel(id, userId, reason);
    
    return {
      status: 'success',
      message: 'Order cancelled successfully',
      data: order,
    };
  }

  @Get(':id/status')
  async getStatusHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id;
    const statusHistory = await this.ordersService.getStatusHistory(id, userId);
    
    return {
      status: 'success',
      message: 'Order status history retrieved successfully',
      data: statusHistory,
    };
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateStatusDto: UpdateOrderStatusDto,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id || updateStatusDto.changedBy;
    const order = await this.ordersService.updateStatus(id, updateStatusDto, userId);
    
    return {
      status: 'success',
      message: 'Order status updated successfully',
      data: order,
    };
  }

  @Get(':id/tracking')
  async getTrackingInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id;
    const trackingInfo = await this.ordersService.getTrackingInfo(id, userId);
    
    return {
      status: 'success',
      message: 'Tracking information retrieved successfully',
      data: trackingInfo,
    };
  }

  @Post(':id/refund')
  async processRefund(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) refundDto: RefundOrderDto,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id;
    const order = await this.ordersService.processRefund(id, refundDto, userId);
    
    return {
      status: 'success',
      message: 'Refund processed successfully',
      data: order,
    };
  }

  @Get(':id/invoice')
  async downloadInvoice(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
    @Request() req: any,
  ) {
    // In a real app, you'd get userId from JWT token
    const userId = req.user?.id;
    const invoiceBuffer = await this.ordersService.generateInvoice(id, userId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
      'Content-Length': invoiceBuffer.length,
    });
    
    res.end(invoiceBuffer);
  }

  // Health check endpoint
  @Get('health/ping')
  ping() {
    return {
      status: 'success',
      message: 'Order service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
