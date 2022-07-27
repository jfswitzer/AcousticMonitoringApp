import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, EventData, NavigatedData, Page } from '@nativescript/core'
import { Button } from 'tns-core-modules/ui/button'
import { HomeViewModel } from './home-view-model'

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = new HomeViewModel()
}
export function onButtonTap(args: EventData) {
  const button = <Button><unknown>args.object;
  console.log('Button tapped');
}
export function onTap(args: EventData) {
  let button = args.object as unknown as Button;
  console.log('Button tapped');
}
