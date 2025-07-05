import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceDto } from '@app/core/model/data/invoice';
import { NavigationService } from '@app/core/service/navigation.service';
import { OrderService } from '@app/core/service/order.service';
import { ToastService } from '@app/lib/toast/toast.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Printer, PrintOptions } from '@bcyesil/capacitor-plugin-printer';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BasePageComponent],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  orderId: number | null = null;
  invoiceData: InvoiceDto | null = null;
  isLoading = true;
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.navigationService.configureNavbar(['home', 'pos']);
    this.orderId = this.route.snapshot.params['id'];
    this.loadInvoiceData();
  }

  loadInvoiceData(): void {
    if (!this.orderId) {
      this.toastService.error('Order ID is required', 'Error');
      return;
    }
    this.isLoading = true;

    this.orderService.getOrderAccount(this.orderId).subscribe({
      next: (response) => {
        this.invoiceData = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error(error.message, 'Error');
        this.isLoading = false;
      },
    });
  }

  async downloadPDF(): Promise<void> {
    const DATA = this.invoiceContent.nativeElement;
    const fileName = `boleta-${this.invoiceData?.invoiceNumber}.pdf`;

    this.toastService.info('Generando PDF...', 'Proceso');
    try {
      const canvas = await html2canvas(DATA, { scale: 2 });
      const fileWidth = 208;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage(FILEURI, 'PNG', 0, 0, fileWidth, fileHeight);

      if (Capacitor.getPlatform() === 'web') {
        PDF.save(fileName);
        return;
      }

      const pdfBase64Full = PDF.output('datauristring');
      const base64Data = pdfBase64Full.split(',')[1];

      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: `Boleta ${this.invoiceData?.invoiceNumber}`,
        text: 'Adjunto se encuentra la boleta en formato PDF.',
        url: result.uri,
        dialogTitle: 'Compartir Boleta',
      });
    } catch (error) {
      console.error('Error al generar o compartir el PDF', error);
      this.toastService.error('No se pudo generar el PDF.', 'Error');
    }
  }

  async printInvoice(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      window.print();
      return;
    }

    try {
      const content = document.querySelector('body')?.innerHTML;
      if (!content) {
        this.toastService.error(
          'No se pudo obtener el contenido para imprimir.',
          'Error'
        );
        return;
      }

      const options: PrintOptions = {
        name: `boleta-${this.invoiceData?.invoiceNumber}.pdf`,
        content: content,
      };

      await Printer.print(options);
    } catch (error) {
      console.error('Error al imprimir', error);
      this.toastService.error(
        'La impresión no está disponible en este momento.',
        'Error'
      );
    }
  }

  proceedToPayment(): void {
    if (!this.orderId) {
      this.toastService.error('No hay pedido creado', 'Error');
      this.navigationService.goTo('menu');
      return;
    }

    this.orderService.payOrder(this.orderId).subscribe({
      next: () => {
        this.toastService.success('Orden pagada', 'Éxito');
        this.navigationService.goTo('tables');
      },
      error: (error) => {
        this.toastService.error(error.message, 'Error');
      },
    });
  }
}
