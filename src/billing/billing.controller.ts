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
  ForbiddenException,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Billing & Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('invoice/create')
  createInvoice(@Body() body: CreateInvoiceDto, @Req() req) {
    // Only doctors and admins can create invoices
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      throw new ForbiddenException('Only doctors and admins can create invoices');
    }
    
    // Get user ID - handle both userId and id fields
    const userId = req.user.userId || req.user.id;
    
    // Automatically assign doctorId if not provided or if logged-in user is a doctor
    if (!body.doctorId || req.user.role === 'doctor') {
      body.doctorId = userId;
    }
    
    return this.billingService.createInvoice(body);
  }

  @Get('invoice/patient/:id')
  getPatientInvoices(@Param('id') patientId: string, @Req() req) {
    // Get user ID - handle both userId and id fields
    const userId = req.user.userId || req.user.id;
    
    console.log('Patient endpoint - Token user ID:', userId, 'Param ID:', patientId, 'Role:', req.user.role);
    
    // Patients can only view their own invoices
    if (req.user.role === 'patient' && userId !== patientId) {
      throw new ForbiddenException('You can only view your own invoices');
    }
    return this.billingService.getInvoicesByPatient(patientId);
  }

  @Get('invoice/doctor/:id')
  getDoctorInvoices(@Param('id') doctorId: string, @Req() req) {
    // Get user ID - handle both userId and id fields
    const userId = req.user.userId || req.user.id;
    
    console.log('Doctor endpoint - Token user ID:', userId, 'Param ID:', doctorId, 'Role:', req.user.role);
    
    // Only doctors and admins can access this endpoint
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      throw new ForbiddenException('Only doctors and admins can view doctor invoices');
    }
    
    // Doctors can only view their own invoices unless admin
    if (req.user.role === 'doctor' && userId !== doctorId) {
      throw new ForbiddenException('You can only view your own invoices');
    }
    
    return this.billingService.getInvoicesByDoctor(doctorId);
  }

  @Get('invoice/:id')
  getInvoiceById(@Param('id') id: string, @Req() req) {
    // Get user ID - handle both userId and id fields
    const userId = req.user.userId || req.user.id;
    return this.billingService.getInvoiceById(id, userId, req.user.role);
  }

  @Patch('invoice/payment/:id')
  updatePayment(@Param('id') id: string, @Body() body: UpdatePaymentDto, @Req() req) {
    // Get user ID - handle both userId and id fields
    const userId = req.user.userId || req.user.id;
    return this.billingService.updatePayment(id, body, userId, req.user.role);
  }

  @Delete('invoice/:id')
  deleteInvoice(@Param('id') id: string, @Req() req) {
    // Only admins can delete invoices
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admins can delete invoices');
    }
    
    // Get user ID - handle both userId and id fields
    const userId = req.user.userId || req.user.id;
    return this.billingService.deleteInvoice(id, userId, req.user.role);
  }
}
