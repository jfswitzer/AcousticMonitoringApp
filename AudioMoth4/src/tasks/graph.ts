import {
    TaskGraph,
    EventListenerGenerator,
    RunnableTaskDescriptor,
} from "nativescript-task-dispatcher/tasks/graph";
import { HomeViewModel } from '../home/home-view-model'

export class DemoTaskGraph implements TaskGraph {
    /*
    private freq: number 
    constructor(num) {
        this.freq = num;
      }
      */
    async describe(
        on: EventListenerGenerator,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        on(
            "startEvent",
            run("record").every(100).cancelOn("stopEvent")
        );
    }
}
//initialize in home view model
export const demoTaskGraph = new DemoTaskGraph();
