import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return this.invoiceModel.find({ patientId }).populate('doctorId', 'name specialization');
  }

  async getInvoicesByDoctor(doctorId: string) {
    return this.invoiceModel.find({ doctorId }).populate('patientId', 'name');
  }

  async updatePayment(invoiceId: string, dto: UpdatePaymentDto) {
    const invoice = await this.invoiceModel.findByIdAndUpdate(invoiceId, dto, { new: true });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }
}
