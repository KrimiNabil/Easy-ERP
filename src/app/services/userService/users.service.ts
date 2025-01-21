import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userURL = "http://localhost:3000/user"
  constructor(private httpClinet: HttpClient) { }
  getUserByID(id: any) {
    return this.httpClinet.get<{ msg: string, user: any }>(`${this.userURL}/${id}`);
  }
  getAllUsers() {
    return this.httpClinet.get<{ msg: string, users: any }>(this.userURL);
  };
  deletUserByID(id: any) {
    return this.httpClinet.delete<{ msg: boolean }>(`${this.userURL}/${id}`);
  };
  updateUser(obj: any) {
    return this.httpClinet.put<{ msg: boolean }>(this.userURL, obj);
  };
  signup(obj: any, avatar: File) {
    let fData = new FormData();
    fData.append("avatar", avatar)
    fData.append("role", obj.role)
    fData.append("firstName", obj.firstName)
    fData.append("userName", obj.userName)
    fData.append("lastName", obj.lastName)
    fData.append("gender", obj.gender)
    fData.append("pwd", obj.pwd)
    fData.append("phone", obj.phone)
    fData.append("email", obj.email)
    fData.append("fullName", obj.fullName)
    fData.append("address", obj.address)
    fData.append("country", obj.country)
    fData.append("city", obj.city)
    fData.append("state", obj.state)
    fData.append("accountHolderName", obj.accountHolderName)
    fData.append("accountNumber", obj.accountNumber)
    fData.append("bankName", obj.bankName)
    fData.append("branchName", obj.branchName)
    fData.append("swiftCode", obj.swiftCode)

    return this.httpClinet.post<{ msg: string, error: any }>(this.userURL, fData);
  }
  login(obj: any) {
    return this.httpClinet.post<{ msg: string, token: string }>(this.userURL + "/login", obj);
  }
  addAgent(obj: any, avatar: File) {
    let fData = new FormData();
    fData.append("avatar", avatar)
    fData.append("firstName", obj.firstName)
    fData.append("userName", obj.userName)
    fData.append("lastName", obj.lastName)
    fData.append("gender", obj.gender)
    fData.append("pwd", obj.pwd)
    fData.append("phone", obj.phone)
    fData.append("email", obj.email)
    fData.append("fullName", obj.fullName)
    fData.append("address", obj.address)
    fData.append("country", obj.country)
    fData.append("city", obj.city)
    fData.append("state", obj.state)
    fData.append("entityID", obj.entityID)

    return this.httpClinet.post<{ msg: string }>(this.userURL + "/addAcountingAgent", fData)
  }
  addSignature(obj: any) {
    let fData = new FormData();
    fData.append("signaturePath", obj.signatureFile)
    fData.append("signatureName", obj.signatureName)
    fData.append("role", obj.jobTitle)
    fData.append("phone", obj.phone)
    fData.append("email", obj.email)
    // fData.append("entityID",obj.entityID)
    return this.httpClinet.post<{ msg: string }>(this.userURL + "/addSignature", fData)
  }
  sendEmail(obj: any) {
    return this.httpClinet.post<{ msg: string, info: any }>(this.userURL + "/sendmail", obj);
  }
  getCustomerStats() {
    return this.httpClinet.get<{ total: number }>(this.userURL + "/customer/stats");
  }
}
