import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './posts.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    // this.fetchPosts();
    this.errorSub = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    // this.http
    //   .post<{ name: string }>(
    //     'https://angular-339-default-rtdb.firebaseio.com/posts.json',
    //     postData
    //   )
    //   .subscribe((responseData) => {
    //     console.log(responseData);
    //   });

    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    // this.fetchPosts();
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onClearPosts() {
    // Send Http request
    this.postService.clearPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  // private fetchPosts() {
  //   this.isFetching = true;
  //   this.http
  //     .get<{ [key: string]: Post }>(
  //       'https://angular-339-default-rtdb.firebaseio.com/posts.json'
  //     )
  //     .pipe(
  //       // map((responseData: { [key: string]: Post }) => {
  //       map((responseData) => {
  //         const postArray: Post[] = [];
  //         for (const key in responseData) {
  //           if (responseData.hasOwnProperty(key)) {
  //             postArray.push({ ...responseData[key], id: key });
  //           }
  //         }
  //         return postArray;
  //       })
  //     )
  //     .subscribe((posts: Post[]) => {
  //       this.isFetching = false;
  //       this.loadedPosts = posts;
  //     });
  // }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onHandleError() {
    this.error = null;
  }
}
