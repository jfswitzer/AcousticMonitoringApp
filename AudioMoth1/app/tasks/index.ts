import { Task, SimpleTask } from "nativescript-task-dispatcher/tasks";
import { toSeconds } from "nativescript-task-dispatcher/utils/time-converter";

export const appTasks: Array<Task> = [
    
    new SimpleTask(
        "record",
        ({ log, onCancel, remainingTime }) =>
            new Promise((resolve) => {
                log(`Available time: ${remainingTime()}`);

                //THIS IS WHERE AUDIO RECORDING WOULD GO 
                // user input will control the recording time 
                const timeoutId = setTimeout(() => {
                    log("Recording start!");
                    resolve();
                }, 2000); //mimic 2 second recording

                onCancel(() => {
                    //stop recording?
                    clearTimeout(timeoutId);
                    resolve();
                });
            })
    ),
];
