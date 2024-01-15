import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';

interface CourseData {
  course:Course,
  lesson:Lesson[]
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseData$:Observable<CourseData>;

  constructor(private route: ActivatedRoute,private coursesService:CoursesService) {

  }

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));
    const course$ = this.coursesService.getCourse(courseId).pipe(startWith(null));
    const lessons$ = this.coursesService.getCourseLessons(courseId).pipe(startWith([]));

    this.courseData$ = combineLatest([course$,lessons$]).pipe(
      tap(val=>console.log(val)), //originalmente retorna un array con dos respuestas
      map(([course,lesson])=>({course,lesson})), //lo q hago es transformar la respuesta 
    )
  }
}











