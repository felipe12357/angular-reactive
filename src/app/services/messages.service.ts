import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessageService {

    private errorSubject = new BehaviorSubject<string []>([])
    errors$:Observable<string[]> = this.errorSubject.asObservable().pipe(
        filter(messages => messages && messages.length>0)
    )

    showErros(error:string[]){
        this.errorSubject.next(error);
    }
}