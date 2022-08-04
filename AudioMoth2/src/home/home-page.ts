import { Application, EventData, NavigatedData, Page } from '@nativescript/core'
import { HomeViewModel } from './home-view-model'


export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = new HomeViewModel()
}



//1. start button--> disable button after clicking, enable stop button 
//2. stop button --> disable after clicking, enable start button, cancel task dispatcher 
//3. make call to NTD 

