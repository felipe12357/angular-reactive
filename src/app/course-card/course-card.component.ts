import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { filter, take, tap } from "rxjs/operators";


@Component({
    selector: 'course-card-component',
    templateUrl: './course-card.component.html',
    styleUrls: ['./course-card.component.css'],
})
export class CourseCardComponent {

    @Input() course:Course;
    @Output() courseUpdateEvent:EventEmitter<any> = new EventEmitter();

    constructor(private dialog: MatDialog){
        
    }

    async editCourse() {

        const dialogConfig = new MatDialogConfig();
    
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "400px";
    
        dialogConfig.data = this.course;
    
        const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
        const val = await dialogRef.afterClosed().pipe(
            filter((val)=>!!val),
            take(1),
           // tap((val)=>console.log(val))
            ).toPromise()
        
        if(val)
            this.courseUpdateEvent.emit(null)

      }
}