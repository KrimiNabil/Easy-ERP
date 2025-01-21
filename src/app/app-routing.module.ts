import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBillComponent } from './components/add-bill/add-bill.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BilsListComponent } from './components/bils-list/bils-list.component';
import { InvoicesListComponent } from './components/invoices-list/invoices-list.component';
import { PurshaseOrdersListComponent } from './components/purshase-orders-list/purshase-orders-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { DisplayUserComponent } from './components/display-user/display-user.component';
import { AddInvoiceComponent } from './components/add-invoice/add-invoice.component';
import { AddPurchaseOrderComponent } from './components/add-purchase-order/add-purchase-order.component';
import { EntitiesListComponent } from './components/entities-list/entities-list.component';
import { AddRequisitionComponent } from './components/add-requisition/add-requisition.component';
import { SignatuesListComponent } from './components/signatues-list/signatues-list.component';
import { EditPayablesComponent } from './components/edit-payables/edit-payables.component';
import { ReqisitionsListComponent } from './components/reqisitions-list/reqisitions-list.component';
import { EditEntityComponent } from './components/edit-entity/edit-entity.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { EntityDetailsComponent } from './components/entity-details/entity-details.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CreateQuotationComponent } from './components/create-quotation/create-quotation.component';
import { QuotationsListComponent } from './components/quotations-list/quotations-list.component';
import { RoleGuard } from './services/guards/role.guard';
import { AddProductComponent } from './components/add-product/add-product.component';
import { LoadingComponent } from './components/loading/loading.component';

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "add-bill", component: AddBillComponent },
  { path: "add-invoice", component: AddInvoiceComponent },
  { path: "creat-Quotations", component: CreateQuotationComponent },
  { path: "add-PO", component: AddPurchaseOrderComponent },
  { path: "add-accounting-agent", component: SignupComponent },
  { path: "add-customer", component: SignupComponent },
  { path: "add-requisition", component: AddRequisitionComponent },
  { path: "add-product", component: AddProductComponent },
  { path: "register-entity", component: SignupComponent },

  { path: "coming-soon", component: ComingSoonComponent },

  { path: "dashboard", component: DashboardComponent },
  { path: "dashboard-admin", component: DashboardComponent },
  { path: "dashboard-entity", component: DashboardComponent },
  { path: "payments", component: BilsListComponent },


  { path: "invoices-list", component: InvoicesListComponent },
  { path: "bills-list", component: BilsListComponent },
  { path: "purchase-orders-list", component: PurshaseOrdersListComponent },
  { path: 'users-list', component: UsersListComponent },
  { path: 'agents-list', component: UsersListComponent },
  { path: 'suppliers-list', component: UsersListComponent },
  { path: 'quotations-list', component: QuotationsListComponent },
  { path: "entities-list", component: EntitiesListComponent },
  { path: "signature-list", component: SignatuesListComponent, },
  { path: "requisitions-list", component: ReqisitionsListComponent },
  { path: "inventory", component: InventoryComponent },

  { path: "loading", component: LoadingComponent },

  { path: 'signup', component: SignupComponent },
  { path: 'signup-admin', component: SignupComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'display-user/:id', component: DisplayUserComponent },
  { path: 'edit-payables/invoice/:id', component: EditPayablesComponent },
  { path: 'edit-payables/bills/:id', component: EditPayablesComponent },
  { path: 'edit-payables/POs/:id', component: EditPayablesComponent },
  { path: 'edit-payables/PRs/:id', component: EditPayablesComponent },
  { path: "edit-entity/:id", component: EditEntityComponent },
  { path: "entity-details/:id", component: EntityDetailsComponent },

  // {path:"",component:LoginComponent},
  // {path:"add-bill",component:AddBillComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"add-invoice",component:AddInvoiceComponent ,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"creat-Quotations",component:CreateQuotationComponent ,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"add-PO",component:AddPurchaseOrderComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"add-purchase-requisition",component:AddRequisitionComponent ,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"add-user",component:SignupComponent,canActivate: [RoleGuard], data: { roles: ['Admin']}},
  // {path:"add-accounting-agent",component:SignupComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner']}},
  // {path:"add-requisition",component:AddRequisitionComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"register-entity",component:SignupComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin']}},

  // {path:"coming-soon",component:ComingSoonComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},

  // {path:"dashboard",component:DashboardComponent},
  // {path:"dashboard-admin",component:DashboardComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin']}},
  // {path:"dashboard-entity",component:DashboardComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner',]}},
  // {path:"payments",component:BilsListComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},


  // {path:"invoices-list",component:InvoicesListComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"bills-list",component:BilsListComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"purchase-orders-list",component:PurshaseOrdersListComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:'users-list',component:UsersListComponent,canActivate: [RoleGuard], data: { roles: ['Admin']}},
  // {path:'agents-list',component:UsersListComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:'suppliers-list',component:UsersListComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:'quotations-list',component:QuotationsListComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"entities-list",component:EntitiesListComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin',]}},
  // {path:"signature-list",component:SignatuesListComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"requisitions-list", component:ReqisitionsListComponent,canActivate: [RoleGuard], data: { roles: ['Admin','Entity Owner', 'Accounting Agent',]} },
  // {path:"inventory", component:InventoryComponent ,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},


  // {path:'signup',component:SignupComponent},
  // {path:'signup-admin',component:SignupComponent},
  // {path:'Login',component:LoginComponent},
  // {path:'edit-user/:id',component:EditUserComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:'display-user/:id',component:DisplayUserComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:'edit-payables/invoice/:id',component:EditPayablesComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:'edit-payables/bills/:id',component:EditPayablesComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:'edit-payables/POs/:id',component:EditPayablesComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:'edit-payables/PRs/:id',component:EditPayablesComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},
  // {path:"edit-entity/:id",component:EditEntityComponent,canActivate: [RoleGuard], data: { roles: [ 'Admin','Entity Owner']}},
  // {path:"entity-details/:id",component:EntityDetailsComponent,canActivate: [RoleGuard], data: { roles: ['Client', 'Admin','Entity Owner', 'Accounting Agent',]}},

  { path: "unauthorized", component: ComingSoonComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect to home

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
