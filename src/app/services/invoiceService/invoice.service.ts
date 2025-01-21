import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceURL = "http://localhost:3000/invoice"
  constructor(private httpClient: HttpClient) { }
  getAllInvoices() {
    return this.httpClient.get<{ msg: string, invoices: any }>(this.invoiceURL)
  };
  getInvoiceByID(id: any) {
    return this.httpClient.get<{ msg: string, invoice: any }>(`${this.invoiceURL}/${id}`);
  };
  deleteInvoiceByID(id: any) {
    return this.httpClient.delete<{ msg: string }>(`${this.invoiceURL}/${id}`);
  };
  addInvoice(invoice: any) {
    return this.httpClient.post<{ msg: string,path:any }>(this.invoiceURL, invoice)
  };
  getInvoice(invoiceID: any) {
    // dont add : befor the object if it's not id or it will be sent with the object and treated as _id
    return this.httpClient.get<{ msg: string, invoice: any }>(`${this.invoiceURL}/number/${invoiceID}`);
  };
  updateInvoice(invoice: any) {
    return this.httpClient.put<{ msg: string,pdf:any }>(this.invoiceURL, invoice)
  };
   // invoice a Quotation by ID
   updateStatuse(id: any,newStatus:any) {
    return this.httpClient.put<{ msg: string ,update:any}>(`${this.invoiceURL}/updateStatuse/${id}`,{status:newStatus});
  }
  getTotalInvoiceAmount(){
    return this.httpClient.get<{totalInvoices:any,msg:string}>(`${this.invoiceURL}/totals/invoices`);
  }
  getRecentInvoices(){
    return this.httpClient.get<{invoices:any,message:string}>(`${this.invoiceURL}/recent/invoice/total`);
  }
  getInvoiceAmountsByStatus() {
    return this.httpClient.get<{statusAmounts:any,msg:string}>(this.invoiceURL+"/amount/status");
  }

}
