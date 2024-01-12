import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, take } from "rxjs/operators";

@Injectable({
    providedIn:'root'
})
export class CoursesService {

    constructor(private http: HttpClient){

    }

    getAllCourses():Observable<Course[]>{
        return this.http.get<Course[]>('/api/courses').pipe(take(1),map((res)=>res["payload"]));
    }

    saveCourse(courseId:string,changes:Partial<Course>):Observable<unknown>{
        return this.http.put(`/api/coursess/${courseId}`,changes)
    }
}