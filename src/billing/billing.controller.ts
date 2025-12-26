import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Billing & Payments')
@ApiBearerAuth()
@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('invoice/create')
  createInvoice(@Body() body: CreateInvoiceDto, @Req() req) {
  // automatically assign doctorId if logged-in user is a doctor
    if (req.user.role === 'doctor') {
      body.doctorId = req.user.userId;
    }
    return this.billingService.createInvoice(body);
  }


  @UseGuards(JwtAuthGuard)
  @Get('invoice/patient/:id')
  getPatientInvoices(@Param('id') patientId: string) {
    return this.billingService.getInvoicesByPatient(patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('invoice/doctor/:id')
  getDoctorInvoices(@Param('id') doctorId: string) {
    return this.billingService.getInvoicesByDoctor(doctorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('invoice/:id')
  getInvoiceById(@Param('id') id: string, @Req() req) {
    return this.billingService.getInvoiceById(id, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('invoice/payment/:id')
  updatePayment(@Param('id') id: string, @Body() body: UpdatePaymentDto) {
    return this.billingService.updatePayment(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('invoice/:id')
  deleteInvoice(@Param('id') id: string, @Req() req) {
    return this.billingService.deleteInvoice(id, req.user.userId, req.user.role);
  }
}
