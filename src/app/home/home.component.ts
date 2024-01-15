import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../services/loading.service';
import { MessageService } from '../services/messages.service';
import { CoursesStoreService } from '../services/courses.store.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private loadingService:LoadingService, private coursesService:CoursesService,private messageService:MessageService,
    private coursesStoreService:CoursesStoreService
    ) {
    
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses(){
    this.beginnerCourses$ = this.coursesStoreService.filterByCategory("BEGINNER");
    this.advancedCourses$ = this.coursesStoreService.filterByCategory("ADVANCED");
  }
}




