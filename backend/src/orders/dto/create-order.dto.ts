import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @IsString()
  pickupAddress: string;

  @IsNumber()
  pickupLat: number;

  @IsNumber()
  pickupLng: number;

  @IsString()
  dropoffAddress: string;

  @IsNumber()
  dropoffLat: number;

  @IsNumber()
  dropoffLng: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  itemDescription: string;

  @IsString()
  itemCategory: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  receiverName?: string;

  @IsOptional()
  @IsString()
  receiverPhone?: string;

  @IsOptional()
  @IsString()
  packageType?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
