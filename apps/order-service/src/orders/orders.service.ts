import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
  OrderFilterDto,
  RefundOrderDto,
} from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private orderStatusHistoryRepository: Repository<OrderStatusHistory>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Calculate total amount
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const finalTotalAmount =
      totalAmount +
      (createOrderDto.shippingAmount || 0) +
      (createOrderDto.taxAmount || 0) -
      (createOrderDto.discountAmount || 0);

    // Create order items
    const orderItems = createOrderDto.items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.productId = item.productId;
      orderItem.productName = item.productName;
      orderItem.productSku = item.productSku;
      orderItem.productImage = item.productImage;
      orderItem.quantity = item.quantity;
      orderItem.unitPrice = item.unitPrice;
      orderItem.totalPrice = item.unitPrice * item.quantity;
      orderItem.attributes = item.attributes;
      return orderItem;
    });

    // Create order
    const order = new Order();
    order.userId = userId;
    order.status = OrderStatus.PENDING;
    order.paymentStatus = PaymentStatus.PENDING;
    order.totalAmount = finalTotalAmount;
    order.shippingAmount = createOrderDto.shippingAmount || 0;
    order.taxAmount = createOrderDto.taxAmount || 0;
    order.discountAmount = createOrderDto.discountAmount || 0;
    order.currency = createOrderDto.currency || 'USD';
    order.shippingAddress = createOrderDto.shippingAddress;
    order.billingAddress = createOrderDto.billingAddress;
    order.paymentMethod = createOrderDto.paymentMethod;
    order.notes = createOrderDto.notes;
    order.items = orderItems;

    const savedOrder = await this.orderRepository.save(order);

    // Create initial status history
    await this.createStatusHistory(
      savedOrder.id,
      OrderStatus.PENDING,
      'Order created',
      userId,
    );

    return savedOrder;
  }

  async findAll(
    filterDto: OrderFilterDto,
    userId?: string,
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, status, paymentStatus, startDate, endDate } = filterDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Order> = {};

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['items', 'statusHistory'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const where: FindOptionsWhere<Order> = { id };
    
    if (userId) {
      where.userId = userId;
    }

    const order = await this.orderRepository.findOne({
      where,
      relations: ['items', 'statusHistory'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
  ): Promise<Order> {
    const order = await this.findOne(id, userId);

    // Prevent updating cancelled or refunded orders
    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.REFUNDED) {
      throw new BadRequestException('Cannot update cancelled or refunded orders');
    }

    // Update order fields
    Object.assign(order, updateOrderDto);

    const updatedOrder = await this.orderRepository.save(order);

    // Create status history if status changed
    if (updateOrderDto.status && updateOrderDto.status !== order.status) {
      await this.createStatusHistory(
        id,
        updateOrderDto.status,
        `Order status updated to ${updateOrderDto.status}`,
        userId,
      );
    }

    return updatedOrder;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
    userId?: string,
  ): Promise<Order> {
    const order = await this.findOne(id, userId);

    // Validate status transition
    this.validateStatusTransition(order.status, updateStatusDto.status);

    order.status = updateStatusDto.status;

    // Update delivered date if status is delivered
    if (updateStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await this.orderRepository.save(order);

    // Create status history
    await this.createStatusHistory(
      id,
      updateStatusDto.status,
      updateStatusDto.notes || `Order status updated to ${updateStatusDto.status}`,
      updateStatusDto.changedBy || userId,
    );

    return updatedOrder;
  }

  async cancel(id: string, userId?: string, reason?: string): Promise<Order> {
    const order = await this.findOne(id, userId);

    // Check if order can be cancelled
    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel shipped or delivered orders');
    }

    order.status = OrderStatus.CANCELLED;
    const updatedOrder = await this.orderRepository.save(order);

    // Create status history
    await this.createStatusHistory(
      id,
      OrderStatus.CANCELLED,
      reason || 'Order cancelled',
      userId,
    );

    return updatedOrder;
  }

  async getStatusHistory(id: string, userId?: string): Promise<OrderStatusHistory[]> {
    const order = await this.findOne(id, userId);
    
    return this.orderStatusHistoryRepository.find({
      where: { orderId: order.id },
      order: { createdAt: 'DESC' },
    });
  }

  async getTrackingInfo(id: string, userId?: string): Promise<{
    trackingNumber: string;
    trackingUrl: string;
    status: OrderStatus;
    estimatedDelivery: Date;
    deliveredAt: Date;
  }> {
    const order = await this.findOne(id, userId);

    return {
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
    };
  }

  async processRefund(
    id: string,
    refundDto: RefundOrderDto,
    userId?: string,
  ): Promise<Order> {
    const order = await this.findOne(id, userId);

    // Check if order can be refunded
    if (order.paymentStatus !== PaymentStatus.PAID) {
      throw new BadRequestException('Order must be paid to process refund');
    }

    if (order.status === OrderStatus.REFUNDED) {
      throw new BadRequestException('Order already refunded');
    }

    // Calculate refund amount
    const refundAmount = refundDto.amount || order.totalAmount;

    if (refundAmount > order.totalAmount) {
      throw new BadRequestException('Refund amount cannot exceed order total');
    }

    // Update order status
    order.status = OrderStatus.REFUNDED;
    order.paymentStatus = PaymentStatus.REFUNDED;

    const updatedOrder = await this.orderRepository.save(order);

    // Create status history
    await this.createStatusHistory(
      id,
      OrderStatus.REFUNDED,
      `Refund processed: $${refundAmount}. Reason: ${refundDto.reason || 'N/A'}`,
      userId,
    );

    return updatedOrder;
  }

  async generateInvoice(id: string, userId?: string): Promise<Buffer> {
    const order = await this.findOne(id, userId);

    // This is a placeholder - in a real application, you would use a PDF library
    // like PDFKit or puppeteer to generate the actual PDF
    const invoiceContent = `
      INVOICE
      
      Order ID: ${order.id}
      Date: ${order.createdAt.toDateString()}
      
      Bill To:
      ${order.billingAddress.firstName} ${order.billingAddress.lastName}
      ${order.billingAddress.address}
      ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}
      
      Items:
      ${order.items.map(item => 
        `${item.productName} x ${item.quantity} - $${item.totalPrice}`
      ).join('\n')}
      
      Subtotal: $${order.totalAmount - order.shippingAmount - order.taxAmount + order.discountAmount}
      Shipping: $${order.shippingAmount}
      Tax: $${order.taxAmount}
      Discount: -$${order.discountAmount}
      
      Total: $${order.totalAmount}
    `;

    return Buffer.from(invoiceContent, 'utf-8');
  }

  private async createStatusHistory(
    orderId: string,
    status: OrderStatus,
    notes: string,
    changedBy?: string,
  ): Promise<void> {
    const statusHistory = new OrderStatusHistory();
    statusHistory.orderId = orderId;
    statusHistory.status = status;
    statusHistory.notes = notes;
    statusHistory.changedBy = changedBy;

    await this.orderStatusHistoryRepository.save(statusHistory);
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
