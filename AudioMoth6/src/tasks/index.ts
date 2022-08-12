import { Task, SimpleTask } from "nativescript-task-dispatcher/tasks";
import { toSeconds } from "nativescript-task-dispatcher/utils/time-converter";
//import { MediaRecorder } from 'extendable-media-recorder';
//import recorder class 
//const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//const mediaRecorder = new MediaRecorder(stream);

export const appTasks: Array<Task> = [
    new SimpleTask("record", ({ log, onCancel, remainingTime}) => new Promise((resolve) => {
                log(`Available time: ${remainingTime()}`);
                //THIS IS WHERE AUDIO RECORDING WOULD GO 
                //how to get the user input here?
                //mediaRecorder.start()
                log("Recording start!");
                const timeoutId = setTimeout(() => {
                    log("Recording stop!");
                    resolve();
                }, 2000); //2 second recording = 2000 
                //mediaRecorder.stop()
                onCancel(() => {
                    clearTimeout(timeoutId);
                    resolve();
                });

            })
    ),
];


