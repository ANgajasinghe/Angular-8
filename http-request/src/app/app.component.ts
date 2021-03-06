import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PostModel} from './post.model';
import {PostsService} from './posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy{
  loadedPosts = [];
  isFetching = false;
  error = null;
  private errorSub : Subscription;


  constructor(private http: HttpClient,private postService : PostsService) {}

  ngOnInit() {
   this.errorSub = this.postService.error.subscribe(errorMessage=>{
      this.error = errorMessage;
    });
    this.fetchPosts();

  }

  onCreatePost(postData: PostModel) {

    this.postService.createAndStorePost(postData.title , postData.content);
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  private fetchPosts() {

    this.isFetching = true;
    this.postService.fetchPosts()
      .subscribe(
        results => {
            this.isFetching = false;
            console.log(results);
            this.loadedPosts = results;
          },error1 => {
          this.error = error1.message;
        });

  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
