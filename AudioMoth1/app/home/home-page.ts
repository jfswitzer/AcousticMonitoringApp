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

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object

  page.bindingContext = new HomeViewModel()
}

//somehow link emitStartEvent() to the start button in home-page.xml 
//For now, havent binded the input values, testing mock recording of 2 seconds everyry 2 minutes 
async function emitStartEvent() {
  const isReady = await taskDispatcher.isReady();
  if (!isReady) {
    const tasksNotReady = await taskDispatcher.tasksNotReady;
    console.log(`The following tasks are not ready!: ${tasksNotReady}`);
    await taskDispatcher.prepare();
  }
  taskDispatcher.emitEvent("startEvent");
}

