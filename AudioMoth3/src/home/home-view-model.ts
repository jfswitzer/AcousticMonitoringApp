import { Observable } from '@nativescript/core'

import { SelectedPageService } from '../shared/selected-page-service'

import { Task, SimpleTask } from "nativescript-task-dispatcher/tasks";
//import { toSeconds } from "nativescript-task-dispatcher/utils/time-converter";

import { taskDispatcher } from "nativescript-task-dispatcher";
export class HomeViewModel extends Observable {
  constructor() {
    super()

    SelectedPageService.getInstance().updateSelectedPage('Home')
  }
  private _durMin: string
  private _durSec: string
  private _freqMin: string
  private _freqSec: string
  private durMinInt: number
  private durSecInt: number
  private freqMinInt: number
  private freqSecInt: number

  private dur: number
  private freq: number 

  get durMin(): string {
    return this._durMin
  }
  get durSec(): string {
    return this._durSec
  }
  get freqMin(): string {
    return this._freqMin
  }
  get freqSec(): string {
    return this._freqSec
  }

  set durMin(value: string) {
    if (this._durMin !== value) {
      this._durMin = value
      this.notifyPropertyChange('durMin', value)
    }
  }
  set durSec(value: string) {
    if (this._durSec !== value) {
      this._durSec = value
      this.notifyPropertyChange('durSec', value)
    }
  }
  set freqMin(value: string) {
    if (this._freqMin !== value) {
      this._freqMin = value
      this.notifyPropertyChange('freqMin', value)
    }
  }
  set freqSec(value: string) {
    if (this._freqSec !== value) {
      this._freqSec = value
      this.notifyPropertyChange('freqSec', value)
    }
  }
  onTap() {
    //TODO:disable button, enable stop butt
    //convert from string to int 
    this.durMinInt = +this.durMin
    this.durSecInt = +this.durSec
    this.freqMinInt = +this.freqMin
    this.freqSecInt = +this.freqSec
    console.info("durMinInt: " + this.durMinInt)
    console.info("durSecInt: " + this.durSecInt)
    console.info("freqMinInt: " + this.freqMinInt)
    console.info("freqSecInt: " + this.freqSecInt)
    //convert dur to milliseconds, freq to seconds
    this.dur = this.durMinInt*60*1000;
    this.dur = this.dur + this.durSecInt*1000;
    this.freq = this.freqMinInt*60;
    this.freq = this.freq + this.freqSecInt;
    console.info("dur (ms): " + this.dur)
    console.info("freq(s): " + this.freq)
    //trigger the task dispatcher
    console.info("next call: emitStartEvent()")
    this.emitStartEvent();


  }
  stop() {
    //TODO:disable button, enable start button 
    console.info("stopEvent emitted!!")
    taskDispatcher.emitEvent("stopEvent");
  }
  
  async emitStartEvent() {
    const isReady = await taskDispatcher.isReady();
    if (!isReady) {
      const tasksNotReady = await taskDispatcher.tasksNotReady;
      console.log(`The following tasks are not ready!: ${tasksNotReady}`);
      await taskDispatcher.prepare();
    }
    console.info("startEvent emitted!!")
    taskDispatcher.emitEvent("startEvent");
  }



//import { MediaRecorder } from 'extendable-media-recorder';
//import recorder class 
//const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//const mediaRecorder = new MediaRecorder(stream);

//task 
appTasks: Array<Task> = [
    new SimpleTask("record", ({ log, onCancel, remainingTime}) => new Promise((resolve) => {
                log(`Available time: ${remainingTime()}`);

                //THIS IS WHERE AUDIO RECORDING WOULD GO 
                const timeoutId = setTimeout(() => {

                    log("Recording start!");
                    //mediaRecorder.start()
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

}
