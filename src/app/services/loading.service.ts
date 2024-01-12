import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, map, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {
    private loadingSubject:BehaviorSubject<boolean> = new BehaviorSubject(false);
    loading$:Observable<boolean> = this.loadingSubject.asObservable();

    loadingUntilComplete<T>(obs:Observable<T>):Observable<T>{
        return of(null).
        pipe(
            tap(()=>this.setLoadingState(true)), //como efecto secundario primero muestro el loading
            concatMap(()=>obs), //ejecuta el observable suministrado
            finalize(() => this.setLoadingState(false)) //cuando se completa oculta el loading
        );
    }

    setLoadingState(val:boolean){
        this.loadingSubject.next(val);
    }
}