import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Invoice } from './schemas/invoice.schema/invoice.schema';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async createInvoice(dto: CreateInvoiceDto) {
    return this.invoiceModel.create(dto);
  }

  async getInvoicesByPatient(patientId: string) {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new NotFoundException('Invalid patient ID');
    }
    
    return this.invoiceModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .populate('doctorId', 'name specialization');
  }

  async getInvoicesByDoctor(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new NotFoundException('Invalid doctor ID');
    }
    
    return this.invoiceModel
      .find({ doctorId: new Types.ObjectId(doctorId) })
      .populate('patientId', 'name');
  }

  async getInvoiceById(id: string, userId: string, role: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid invoice ID');
    }

    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Convert ObjectIds to strings for comparison
    const invoicePatientId = invoice.patientId?.toString();
    const invoiceDoctorId = invoice.doctorId?.toString();

    if (
      role !== 'admin' &&
      invoicePatientId !== userId &&
      invoiceDoctorId !== userId
    ) {
      throw new ForbiddenException('You are not allowed to view this invoice');
    }

    return invoice;
  }

  async updatePayment(invoiceId: string, dto: UpdatePaymentDto) {
    if (!Types.ObjectId.isValid(invoiceId)) {
      throw new NotFoundException('Invalid invoice ID');
    }

    const invoice = await this.invoiceModel.findByIdAndUpdate(invoiceId, dto, {
      new: true,
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    
    return invoice;
  }

  async deleteInvoice(id: string, userId: string, role: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid invoice ID');
    }

    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Convert ObjectIds to strings for comparison
    const invoicePatientId = invoice.patientId?.toString();
    const invoiceDoctorId = invoice.doctorId?.toString();

    if (
      role !== 'admin' &&
      invoicePatientId !== userId &&
      invoiceDoctorId !== userId
    ) {
      throw new ForbiddenException('You are not allowed to delete this invoice');
    }

    await this.invoiceModel.findByIdAndDelete(id);

    return {
      message: 'Invoice deleted successfully',
      deletedInvoiceId: id,
    };
  }
}