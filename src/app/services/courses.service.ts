import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay, take } from "rxjs/operators";
import { Lesson } from "../model/lesson";

@Injectable({
    providedIn:'root'
})
export class CoursesService {

    constructor(private http: HttpClient){

    }

    getCourseLessons(id:number):Observable<Lesson[]>{
        return this.http.get<Lesson[]>(`/api/lessons`,{
            params:{
                courseId:id,
                pageSize:"100"
            }
        }).pipe( map(res => res["payload"]),)
    }

    getCourse(id:number):Observable<Course> {
        return this.http.get<Course>(`/api/courses/${id}`)
    }

    getAllCourses():Observable<Course[]>{
        return this.http.get<Course[]>('/api/courses').pipe(take(1),map((res)=>res["payload"]));
    }

    saveCourse(courseId:string,changes:Partial<Course>):Observable<unknown>{
        return this.http.put(`/api/coursess/${courseId}`,changes)
    }

    searchLessons(search:string):Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons',{
            params:{
                filter:search,
                pageSize:"100"
            }
        }).pipe(
            map(res => res["payload"]),
            shareReplay()
        )
    }
}