import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../services/loading.service';
import { MessageService } from '../services/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private loadingService:LoadingService, private coursesService:CoursesService,private messageService:MessageService) {
    
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses(){
    //   this.loadingService.setLoadingState(true);
    const courses:Observable<Course[]> =  this.coursesService.getAllCourses()
    .pipe( 
      shareReplay(), //Importante utilizar el share Replay para poder hacer multiples subscriciones sin tener q hacer multiples llamados al backend
      map( courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = "error desde el home " + err.message;
        this. messageService.showErros([message]);
        return throwError(err); //esto crea un nuevo observable q emite el error y se completa
      })


      //esta era la altenativa tradicional para mostrar el loading
    /*   finalize(()=>{ //esto se ejecuta cuando se completa el observable
          this.loadingService.setLoadingState(false);
      }) */
    );

    //ahora en cambio para mostrar el loading lo hacemos atravez de un observable
    const loadingCourses$ = this.loadingService.loadingUntilComplete(courses);

    this.beginnerCourses$ = loadingCourses$.pipe(map((courses => courses.filter(course =>course.category === "BEGINNER"))))
    this.advancedCourses$ = loadingCourses$.pipe(map((courses => courses.filter(course =>course.category === "ADVANCED"))));
   
   
  }
}




