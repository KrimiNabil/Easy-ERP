import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { HomeComponent } from './components/home/home.component';

import { FooterComponent } from './components/footer/footer.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddInvoiceComponent } from './components/add-invoice/add-invoice.component';
import { AddPurchaseOrderComponent } from './components/add-purchase-order/add-purchase-order.component';

import { BilsListComponent } from './components/bils-list/bils-list.component';
import { InvoicesListComponent } from './components/invoices-list/invoices-list.component';
import { PurshaseOrdersListComponent } from './components/purshase-orders-list/purshase-orders-list.component';
import { LeftSidebrComponent } from './components/left-sidebr/left-sidebr.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { DisplayUserComponent } from './components/display-user/display-user.component';

import { EntitiesListComponent } from './components/entities-list/entities-list.component';
import { EntityDetailsComponent } from './components/entity-details/entity-details.component';
import { AddRequisitionComponent } from './components/add-requisition/add-requisition.component';
import { SignatuesListComponent } from './components/signatues-list/signatues-list.component';
import { EditPayablesComponent } from './components/edit-payables/edit-payables.component';
import { ReqisitionsListComponent } from './components/reqisitions-list/reqisitions-list.component';
import { EditEntityComponent } from './components/edit-entity/edit-entity.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CreateQuotationComponent } from './components/create-quotation/create-quotation.component';
import { QuotationsListComponent } from './components/quotations-list/quotations-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { LoadingComponent } from './components/loading/loading.component';


@NgModule({
  declarations: [
    AppComponent,
    AddBillComponent,
    HomeComponent,

    FooterComponent,
    AddInvoiceComponent,
    AddPurchaseOrderComponent,
  
    BilsListComponent,
    InvoicesListComponent,
    PurshaseOrdersListComponent,
    LeftSidebrComponent,
    MainDashboardComponent,
    UsersListComponent,
    SignupComponent,
    LoginComponent,
    EditUserComponent,
    DisplayUserComponent,
   DashboardComponent,
    EntitiesListComponent,
    EntityDetailsComponent,
    AddRequisitionComponent,
    SignatuesListComponent,
    EditPayablesComponent,
    ReqisitionsListComponent,
    EditEntityComponent,
    ComingSoonComponent,
    InventoryComponent,
    CreateQuotationComponent,
    QuotationsListComponent,
    AddProductComponent,
    LoadingComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import Form Modules
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // to us ngIf
    CommonModule,
   
  
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
