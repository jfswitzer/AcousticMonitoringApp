
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

import * as app from "tns-core-modules/application";


// NativeScript Task Dispatcher plugin imports
// (always between imports and app initialization)
import { taskDispatcher } from "nativescript-task-dispatcher";
import { appTasks } from "./tasks";
import { demoTaskGraph } from "./tasks/graph";

taskDispatcher.init(appTasks, demoTaskGraph, {
  // Recommended, to see debug and info messages while developing
  enableLogging: true,
});

// TypeScript App:
app.run({ moduleName: "app-root" });
