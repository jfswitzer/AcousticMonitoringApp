import {
    TaskGraph,
    EventListenerGenerator,
    RunnableTaskDescriptor,
} from "nativescript-task-dispatcher/tasks/graph";

export class DemoTaskGraph implements TaskGraph {
    private freq: number
    constructor(num){
        this.freq = num;
    }
    async describe(
        on: EventListenerGenerator,
        run: RunnableTaskDescriptor
    ): Promise<void> {
        on(
            "startEvent",
            //replace 2 minutes with input 
            run("record").every(1, "minutes").cancelOn("stopEvent")
        );
    }
}
//export const demoTaskGraph = new DemoTaskGraph();
