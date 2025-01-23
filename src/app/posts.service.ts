import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}
  error = new Subject<string>();

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };
    this.http
      .post<{ name: string }>(
        'https://angular-339-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angular-339-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        // map((responseData: { [key: string]: Post }) => {
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError((error) => {
          // Send to analytics server
          return throwError(error)
        })
      );
    //   .subscribe((posts: Post[]) => {});
  }

  clearPosts() {
    return this.http.delete(
      'https://angular-339-default-rtdb.firebaseio.com/posts.json'
    );
  }
}
