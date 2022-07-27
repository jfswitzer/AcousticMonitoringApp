import { Application, EventData, NavigatedData, Page } from '@nativescript/core'
import { View } from "tns-core-modules/ui/core/view";
import { Button } from 'tns-core-modules/ui/button'
import { HomeViewModel } from './home-view-model'


export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = new HomeViewModel()
}

//not working, does not appear in console 
export function onButtonTap(args: EventData) {
  //const button = <View><unknown>args.object
  console.info("Button tapped");
}

