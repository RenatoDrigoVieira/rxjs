import { Component, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, interval, Observable, Subscription, timer } from 'rxjs';
import {map, delay, filter, tap, take, debounceTime, takeWhile, takeUntil} from 'rxjs/operators'
import { MatRipple } from '@angular/material';

@Component({
  selector: 'app-operatos',
  templateUrl: './operatos.component.html',
  styleUrls: ['./operatos.component.css']
})
export class OperatosComponent implements OnInit {

  @ViewChild(MatRipple,{static:false}) ripple: MatRipple

  constructor() { }

  ngOnInit() {
  }

  mapClick(){
    from([1,2,3,4,5,6,7]).pipe(
      map(i=> i*2),
      map(i=> i*10),
      delay(1000)

    ).subscribe(i=>console.log(i))
    fromEvent(document,'click').pipe(
      map((e: MouseEvent) => ({x:e.screenX, y: e.screenY}))
    ).subscribe((pos) =>console.log(pos))
  }
  filterClick(){
    from([1,2,3,4,5,6,7]).pipe(
      map(i=> i*2),
      filter(i=> i%2 !==1)

    ).subscribe(i=>console.log(i))

    interval(1000).pipe(
      filter(i=>i%2 ==0),
      map(i=> `Value ${i}`),
      delay(1000)
    ).subscribe(i=>console.log(i))
  }

  tapClick(){
    interval(1000).pipe(
      tap(i=> console.log("")),
      tap(i=> console.warn("Before filter ",i)),
      filter(i=>i%2 ==0),
      tap(i=> console.warn("After filtering ",i)),
      map(i=> `Value ${i}`),
      tap(i=> console.warn("After maping",i)),
      delay(1000)
    ).subscribe(i=>console.log(i))
  }
  takeClick(){
    const observable = new Observable((observer) =>{
      let i;
      for(i=0;i<20;i++){
        setTimeout(()=>observer.next(Math.floor(Math.random()*100)),i*100);
      }
      setTimeout(()=>observer.complete(),i*100)
    })

    const s: Subscription = observable.pipe(
      tap(i=>console.log(i)),
      take(10)
      //first()
      //last()
    ).subscribe((v)=>console.log('Output: ' ,v),
    (error)=>console.log(error),
    ()=>console.log('Completado'))

    const interv = setInterval(()=>{
      console.log('Checking...')
      if(s.closed){
        console.log('Subscription closed');
        clearInterval(interv);
      }
    },200)
  }

  launchRipple(){
    const rippleRef = this.ripple.launch({
      persistent: true,centered:true
    })
    rippleRef.fadeOut()
  }

  debounceTimeClick(){
    fromEvent(document,'click')
    .pipe(
      tap((e)=>console.log('Click')),
      debounceTime(1000)
    )
    .subscribe((e: MouseEvent)=>{
      console.log("Click with debounceTime: ",e )
      this.launchRipple()
    })
  }
  takeWhile(){
    interval(500)
      .pipe(
        takeWhile((value,index)=>
          (value<5)
        )
      )
      .subscribe(
        (i) => console.log('takeWhile',i),
        (error) => console.error(error),
        () => console.log('Completed')
      )
  }

  takeUntil(){
    let duetime$= timer(5000)

    interval(500)
      .pipe(
        takeUntil(duetime$)
      )
      .subscribe(
        (i) => console.log('takeUntil',i),
        (error) => console.error(error),
        () => console.log('Completed')
      )
  }
}
