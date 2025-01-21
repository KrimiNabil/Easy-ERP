import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
entityURL="http://localhost:3000/entity"
  constructor(private httpClient:HttpClient) { }
  getAllEntities(){
  return  this.httpClient.get<{msg:string,entities:any}>(this.entityURL)
  };
  addEntity(entity:any,logo:File){
    let fData=new FormData();
    fData.append("logo",logo)
    fData.append("owner",entity.owner)
    fData.append("name",entity.name)
    fData.append("registrationNumber",entity.registrationNumber)
    fData.append("industry",entity.industry)
    fData.append("website",entity.website)
    fData.append("email",entity.email)
    fData.append("phone",entity.phone)
    fData.append("street",entity.street)
    fData.append("country",entity.country)
    fData.append("city",entity.city)
    fData.append("state",entity.state)
    fData.append("accountHolderName",entity.accountHolderName)
    fData.append("accountNumber",entity.accountNumber)
    fData.append("bankName",entity.bankName)
    fData.append("branchName",entity.branchName)
    fData.append("swiftCode",entity.swiftCode)
  return  this.httpClient.post<{msg:string}>(this.entityURL,fData)
  };
  updateEntity(entity:any){
  return  this.httpClient.put<{msg:string}>(this.entityURL,entity)
  };
  getEntityByID(id:any){
  return  this.httpClient.get<{msg:string,entity:any}>(`${this.entityURL}/${id}`)
  };
  deleteEntity(id:any){
  return  this.httpClient.delete<{msg:string}>(`${this.entityURL}/${id}`)
  };
}
