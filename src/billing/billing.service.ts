import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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
    return this.invoiceModel
      .find({ patientId })
      .populate('doctorId', 'name specialization');
  }

  async getInvoicesByDoctor(doctorId: string) {
    return this.invoiceModel
      .find({ doctorId })
      .populate('patientId', 'name');
  }

  async getInvoiceById(id: string, userId: string, role: string) {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');

    if (
      role !== 'admin' &&
      invoice.patientId.toString() !== userId &&
      invoice.doctorId.toString() !== userId
    ) {
      throw new ForbiddenException('You are not allowed to view this invoice');
    }

    return invoice;
  }

  async updatePayment(invoiceId: string, dto: UpdatePaymentDto) {
    const invoice = await this.invoiceModel.findByIdAndUpdate(invoiceId, dto, {
      new: true,
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async deleteInvoice(id: string, userId: string, role: string) {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');

    if (
      role !== 'admin' &&
      invoice.patientId.toString() !== userId &&
      invoice.doctorId.toString() !== userId
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
