import { Component, OnInit } from '@angular/core';
import { QuotationService } from 'src/app/services/priceService/quotation.service';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-quotations-list',
  templateUrl: './quotations-list.component.html',
  styleUrls: ['./quotations-list.component.css']
})
export class QuotationsListComponent implements OnInit {
  quotations: any = []
  fileToSend: any = {}
  constructor(private quotationServ: QuotationService, private userServ: UsersService) { }

  ngOnInit(): void {
    this.quotationServ.getAllQuotations().subscribe(
      (res) => {
        this.quotations = res.quotations
        console.log(res.quotations);

      }
    )
  }
  changeStatus(quotation: any, newStatus: string) {
    this.quotationServ.updateStatuse(quotation._id, newStatus).subscribe(
      (res) => {
        if (res.update) {
          this.quotationServ.getAllQuotations().subscribe(
            (res) => {
              this.quotations = res.quotations
              console.log(res.quotations);

            })
        } else {
          alert("error")
        }
      }
    )
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'bg-success-light me-2 text-success-light';
      case 'Completed':
        return 'bg-primary-light me-2 text-primary-light';
      case 'Rejected':
        return 'bg-danger-light me-2 text-danger-light';
      case 'Pending':
        return 'bg-history-light me-2 text-history-light';
      default:
        return 'bg-history-light me-2 text-history-light';
    }
  }

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
  }
  deletePQ(id:any){
    console.log(id);
    this.quotationServ.deleteQuotationByID(id).subscribe(
      (res)=>{
        if (res.msg==="PQ deleted successfully") {
          this.quotationServ.getAllQuotations().subscribe(
            (res) => {
              this.quotations = res.quotations
              console.log(res.quotations);
            }
          )
        }
      }
    )
  }
}
