import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { User } from "../model/user";
import { map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { JsonPipe } from "@angular/common";

const AUTH_USER ="auth_user"

@Injectable({
    providedIn:'root'
})
export class AuthStoreService {
    private userBehaviorSubject:BehaviorSubject<User> = new BehaviorSubject<User>(null);
    user$:Observable<User> = this.userBehaviorSubject.asObservable();
    isLoggedIn$: Observable<boolean>;
  

    constructor(private http:HttpClient) {
        
        this.isLoggedIn$ = this.user$.pipe(map(user => { 
           // console.log(!!user, user, !user); 
            return !!user
        }));

        const user = localStorage.getItem(AUTH_USER);
        if(user)
            this.userBehaviorSubject.next(JSON.parse(user))
    }

    login(email:string, password:string):Observable<User> {
        return this.http.post<User>("/api/login",{email,password}).pipe(
            tap(user =>{
                localStorage.setItem(AUTH_USER,JSON.stringify(user));
                this.userBehaviorSubject.next(user);
            })
        )
    }

    logout(){
        this.userBehaviorSubject.next(null)
        localStorage.removeItem(AUTH_USER);
    }
}


