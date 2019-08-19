import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, toArray, delay } from 'rxjs/operators';

interface User{
  login: string
  name: string
}

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.css']
})
export class AsyncComponent implements OnInit {

  private options$: Observable<string[]>;
  private user$: Observable<User>;
    
  

  constructor() { }

  ngOnInit() {
    this.options$ = Observable.create((observer)=>{
      for(let i=0;i<10;i++){
        observer.next(`This is my ${i}th option.`)
      }
      observer.complete();
    }).pipe(
      map(s=>s+'!'),
      toArray(),
      delay(2000)  
    )

    //this.options$.subscribe(s=>console.log(s))

    this.user$ = new Observable<User>((observer)=>{
      let names = ['Mr John','Mr James','Mr Ray', 'Ms. Angel']
      let logins = ['John','James','Ray', 'Angel']
      let i =0;
      setInterval(()=>{
        if(i==4){
          observer.complete()
        }else{
          observer.next({login: logins[i],name: names[i]})
        }
        i++
      },2000)
    })
    this.user$.subscribe(s=>console.log(s))
     
  }

}
