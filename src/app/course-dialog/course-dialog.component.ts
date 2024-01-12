import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { MessageService } from '../services/messages.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers:[MessageService] //con esto estamos asignando una instancia del MessageService a este componente y todos sus componentes hijos
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        private coursesService:CoursesService,
        private messageService:MessageService,
        @Inject(MAT_DIALOG_DATA) course:Course) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    async save() {
      const changes = this.form.value;
      const val = await this.coursesService.saveCourse(this.course.id,changes).pipe(
        catchError(err =>{
            const message = "error desde el dialog " + err.message;
            this.messageService.showErros([message]);
            return throwError(err)
        })
      ).toPromise();
      //importante pasarle el val a close, con esto distingo si se cerro por medio de save o de la opcion close
      //esto lo uso luego para actualizar la informacion
      this.dialogRef.close(val);

    }

    close() {
        this.dialogRef.close();
    }

}
