import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { CoursesService } from "./courses.service";
import { MessageService } from "./messages.service";
import { LoadingService } from "./loading.service";

@Injectable({
    providedIn:'root'
})
export class CoursesStoreService {

    private coursesSubject:BehaviorSubject<Course[]> = new BehaviorSubject([])
    courses$: Observable<Course[]> = this.coursesSubject.asObservable();

    constructor(private coursesService:CoursesService,private messageService:MessageService,private loadingService:LoadingService){
        this.loadCourses();
    }

    async loadCourses(){
        //esta era la altenativa tradicional para mostrar el loading
        //   this.loadingService.setLoadingState(true);
        const courses$:Observable<Course[]> = this.coursesService.getAllCourses().pipe(
            shareReplay(), //Importante utilizar el share Replay para poder hacer multiples subscriciones sin tener q hacer multiples llamados al backend
            catchError(err => {
                const message = "error desde el courses store " + err.message;
                this. messageService.showErros([message]);
                return throwError(err); //esto crea un nuevo observable q emite el error y se completa
              }),
            tap((courses)=>{
                this.coursesSubject.next(courses) 
            })

            //esta era la altenativa tradicional para mostrar el loading
            /*   finalize(()=>{ //esto se ejecuta cuando se completa el observable
                    this.loadingService.setLoadingState(false);
            }) */
        )
         //ahora en cambio para mostrar el loading lo hacemos atravez de un observable
        await this.loadingService.loadingUntilComplete(courses$).toPromise();
    }

    updateCourse(id:string,changes:Partial<Course>){

        const courses = this.coursesSubject.getValue()
        const courseIndex = courses.findIndex(course => course.id === id);
        const newCourse = {...courses[courseIndex],...changes};

        const newCoursesList = courses.slice(0); //asi creo una copia de la lista de courses
        newCoursesList[courseIndex] = newCourse;

        this.coursesSubject.next(newCoursesList);

       return this.coursesService.saveCourse(id,changes).pipe(
        catchError(err =>{
            const message = "error desde el dialog  courses store" + err.message;
            this.messageService.showErros([message]);
            return throwError(err)
        })
       )
    }

    filterByCategory(category:string):Observable<Course[]>{
        return this.courses$.pipe(
            map(courses =>
                courses.filter(course =>course.category === category)
                .sort(sortCoursesBySeqNo)
            )
        )
    }

}