import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { UserRegisterModel } from "./models/user/user.register.model";
import { Observable, catchError } from "rxjs";
import { UserLoginModel } from "./models/user/user.login.model";
import { AuthenticationModel } from "./models/authentication.model";

@Injectable({providedIn:"root"})
export class UserApiService{
    // Api Manzili
    private apiUrl = "https://localhost:7274/api/auth";
    
    private client: HttpClient=inject(HttpClient);

    public registerUser(user:UserRegisterModel): Observable<any>{
        return this.client.post(`${this.apiUrl}/register`,user);
    }
    
    public loginUser(user:UserLoginModel):Observable<AuthenticationModel>{
        return this.client.post<AuthenticationModel>(`${this.apiUrl}/login`,user);
    }

}