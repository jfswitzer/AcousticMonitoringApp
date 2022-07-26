/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { NavigatedData, Page } from '@nativescript/core'

import { HomeViewModel } from './home-view-model'
import { EventData } from "tns-core-modules/data/observable"
import { Button } from "tns-core-modules/ui/button"
import { TextField } from 'tns-core-modules'
import { taskDispatcher } from "nativescript-task-dispatcher";
import { Label } from "tns-core-modules/ui/label";
import { getViewById } from "tns-core-modules/ui/core/view";
import { View } from "tns-core-modules/ui/core/view";
import { alert, AlertOptions } from "tns-core-modules/ui/dialogs";



export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object
  
  page.bindingContext = new HomeViewModel()
}



//var view = require("tns-core-modules/ui/core/view");
//test function to see if test button works 
export function test(args: EventData) {
  const page = <Page>args.object

  //want to check if input values are being obtained correctly? 
  var inputValue = (<HTMLInputElement>document.getElementById("durMin")).value;
  
  //var testLabel = document.getElementById("TestLabel")as HTMLElement | null;
  var testLabel = (<HTMLInputElement>document.getElementById("TestLabel"));
  testLabel.setAttribute("TestLabel", inputValue);
  //testLabel.textContent=inputValue;

}


export function onButtonTap(args: EventData) {
  const button = <Button>args.object;
  console.log('Button tapped');
}









//somehow link emitStartEvent() to the start button in home-page.xml 
//For now, havent binded the input values, testing mock recording of 2 seconds every 2 minutes 
async function emitStartEvent() {
  const isReady = await taskDispatcher.isReady();
  if (!isReady) {
    const tasksNotReady = await taskDispatcher.tasksNotReady;
    console.log(`The following tasks are not ready!: ${tasksNotReady}`);
    await taskDispatcher.prepare();
  }
  taskDispatcher.emitEvent("startEvent");
}

