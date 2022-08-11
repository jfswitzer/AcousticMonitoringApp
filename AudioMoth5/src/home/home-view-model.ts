
import { Observable } from '@nativescript/core'

import { SelectedPageService } from '../shared/selected-page-service'

import { Task, SimpleTask } from "nativescript-task-dispatcher/tasks";
//import { toSeconds } from "nativescript-task-dispatcher/utils/time-converter";
import { appTasks } from "../tasks/index";
import { demoTaskGraph } from "../tasks/graph";
import { taskDispatcher } from "nativescript-task-dispatcher";
export class HomeViewModel extends Observable {
  constructor() {
    super()
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
    //initialize demograph
    taskDispatcher.init(appTasks, demoTaskGraph, {
      // Recommended, to see debug and info messages while developing
      enableLogging: true,
    });
    //trigger the task dispatcher
    console.info("next call: emitStartEvent()")
    console.info("startEvent emitted!!")
    taskDispatcher.emitEvent("startEvent");
    //this.emitStartEvent();

  }
  stop() {
    //TODO:disable button, enable start button 
    console.info("stopEvent emitted!!")
    //taskDispatcher.emitEvent("stopEvent");
  }

  /*
  async emitStartEvent() {
    const isReady = await taskDispatcher.isReady();
    //COMMENT OUT IF STATEMENT
    if (!isReady) {
      const tasksNotReady = await taskDispatcher.tasksNotReady;
      console.log(`The following tasks are not ready!: ${tasksNotReady}`);
      await taskDispatcher.prepare();
    }
    console.info("startEvent emitted!!")
    taskDispatcher.emitEvent("startEvent");
  }
  */
}
