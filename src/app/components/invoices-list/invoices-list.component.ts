import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoiceService/invoice.service';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css']
})
export class InvoicesListComponent implements OnInit {
  invoices: any = [];
  fileToSend: any = {};
  constructor(private invServ: InvoiceService, private router: Router, private userServ: UsersService) { }
  ngOnInit(): void {
    this.invServ.getAllInvoices().subscribe(
      (res) => {
        this.invoices = res.invoices
        console.log(this.invoices);
      }
    )
  }
  amount(tab: any) {
    return tab.reduce((sum: number, elt: any) => sum + elt.amount, 0);
  }
  display(id: any) { };
  edit(id: any) {
    this.router.navigate([`edit-payables/invoice/${id}`])
  };

  delete(id: any) {
    this.invServ.deleteInvoiceByID(id).subscribe(
      (res) => {
        if (res.msg == "deleted") {
          this.invServ.getAllInvoices().subscribe(
            (res) => {
              this.invoices = res.invoices
            }
          )
        }
      }
    )
  };

  changeStatus(id: any, newStatus: string) {
    this.invServ.updateStatuse(id, newStatus).subscribe(
      (res) => {
        if (res.update) {
          this.invServ.getAllInvoices().subscribe(
            (res) => {
              this.invoices = res.invoices
              console.log(this.invoices);

            })
        } else {
          alert("error")
        }
      }
    )
  } ;

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'bg-success-light text-success-light';
      case 'Completed':
        return 'bg-primary-light me-2 text-primary-light';
      case 'Rejected':
        return 'bg-danger-light text-danger-light';
      default:
        return 'bg-history-light me-2 text-history-light';
    }
  };

  sendEmail(pdfUrl: string) {
    this.fileToSend.customerEmail = "anonyhack.nabil@gmail.com"
    this.fileToSend.pdfUrl = pdfUrl
    console.log(this.fileToSend);
    this.userServ.sendEmail(this.fileToSend).subscribe(
      (res) => {
        console.log(res.msg);
        // if (res.info) {
        //   alert('Email sent successfully.');
        // } else {
        //   alert('Failed to send email.');
        // }

      });
  };
}
