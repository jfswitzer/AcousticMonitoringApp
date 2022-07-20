/*
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, EventData, NavigatedData, Page } from '@nativescript/core'

import { HomeViewModel } from './home-view-model'

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = new HomeViewModel()
}

export function onDrawerButtonTap(args: EventData) {
  const sideDrawer = <RadSideDrawer>Application.getRootView()
 
  sideDrawer.showDrawer()
}
*/



import { taskDispatcher } from "nativescript-task-dispatcher";

import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { HomeViewModel } from "./home-view-model";

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;

  page.bindingContext = new HomeViewModel();

  emitStartEvent();
}

async function emitStartEvent() {
  const isReady = await taskDispatcher.isReady();
  if (!isReady) {
    const tasksNotReady = await taskDispatcher.tasksNotReady;
    console.log(`The following tasks are not ready!: ${tasksNotReady}`);
    await taskDispatcher.prepare();
  }
  taskDispatcher.emitEvent("startEvent");
}