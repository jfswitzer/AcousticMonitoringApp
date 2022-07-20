import { Application } from '@nativescript/core'


// NativeScript Task Dispatcher plugin imports
// (always between imports and app initialization)
import { taskDispatcher } from "nativescript-task-dispatcher";
import { appTasks } from "./tasks/index";
import { demoTaskGraph } from "./tasks/graph";

taskDispatcher.init(appTasks, demoTaskGraph, {
  // Recommended, to see debug and info messages while developing
  enableLogging: true,
});



Application.run({ moduleName: 'app-root/app-root' })


/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
