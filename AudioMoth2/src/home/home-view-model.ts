import { Observable } from '@nativescript/core'

import { taskDispatcher } from "nativescript-task-dispatcher";

export class HomeViewModel extends Observable {
  private _durMin: string
  private _durSec: string
  private _freqMin: string
  private _freqSec: string
  public durMinInt: number
  public durSecInt: number
  public freqMinInt: number
  public freqSecInt: number

  constructor() {
    super()
  }

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
    console.info("durMin: " + this.durMin)
    console.info("durSec: " + this.durSec)
    console.info("freqMin: " + this.freqMin)
    console.info("freqSec: " + this.freqSec)

    //convert from string to int 
    this.durMinInt = +this.durMin
    this.durSecInt = +this.durSec
    this.freqMinInt = +this.freqMin
    this.freqSecInt = +this.freqSec
    console.info("durMinInt: " + this.durMinInt)
    console.info("durSecInt: " + this.durSecInt)
    console.info("freqMinInt: " + this.freqMinInt)
    console.info("freqSecInt: " + this.freqSecInt)

    //convert to milliseconds? 
    
    //convert from min to sec or milliseconds?

    //trigger the task dispatcher
    this.emitStartEvent();
  }
  stop() {
    taskDispatcher.emitEvent("stopEvent");
  }
  
  async emitStartEvent() {
    const isReady = await taskDispatcher.isReady();
    /*
    if (!isReady) {
      const tasksNotReady = await taskDispatcher.tasksNotReady;
      console.log(`The following tasks are not ready!: ${tasksNotReady}`);
      await taskDispatcher.prepare();
    }
    */
    taskDispatcher.emitEvent("startEvent");
  }

  
}
