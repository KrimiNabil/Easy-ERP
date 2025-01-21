import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
 @Input() isLoading:boolean=false // Control visibility from the parent
  constructor() { }

  ngOnInit(): void { 
    
  }

}
