

import { Observable } from '@nativescript/core'
import { SelectedPageService } from '../shared/selected-page-service'
import {
  Application,Dialogs,File,isAndroid,knownFolders,
  Page,Slider,Utils,CoreTypes,path
} from '@nativescript/core';
import { Task, SimpleTask } from "nativescript-task-dispatcher/tasks";
import { DemoTaskGraph } from "../tasks/graph";
import { taskDispatcher } from "nativescript-task-dispatcher";
import {
  AudioRecorderOptions,
  TNSRecorder
} from 'nativescript-audio';
//import * as geolocation from "nativescript-geolocation";

export class HomeViewModel extends Observable {
  constructor() {
    super()
    this.message = `Status: Waiting to Start`;
    this.startBtnStatus = 'true';
    this.stopBtnStatus = 'false';

    var documents = knownFolders.documents();
    this._logFile = documents.getFile("audioMothLog.txt");

    SelectedPageService.getInstance().updateSelectedPage('Home')
  }
  /*
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
  */
  private _recorder: TNSRecorder;
  private _message: string
  private _startBtnStatus: string
  private _stopBtnStatus: string
  private _logFile: File; 
  private appTasks: Array<Task>

  get message(): string {
    return this._message
  }

  set message(value: string) {
    if (this._message !== value) {
      this._message = value
      this.notifyPropertyChange('message', value)
    }
  }
  get startBtnStatus(): string {
    return this._startBtnStatus
  }

  set startBtnStatus(value: string) {
    if (this._startBtnStatus !== value) {
      this._startBtnStatus= value
      this.notifyPropertyChange('startBtnStatus', value)
    }
  }
  get stopBtnStatus(): string {
    return this._stopBtnStatus
  }

  set stopBtnStatus(value: string) {
    if (this._stopBtnStatus !== value) {
      this._stopBtnStatus = value
      this.notifyPropertyChange('stopBtnStatus', value)
    }
  }
  /*
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
  */

  onTap() {
    this.message = `Status: Preparing task dispatcher`;
    this.startBtnStatus = 'false';
    this.stopBtnStatus = 'true';
    /*
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
    */
    //initialize appTask
    this.initializeAppTasks();

    //initialise demoTaskGraph
    var demoTaskGraph = new DemoTaskGraph(1);//record every 1 min 

    //load taskgraph
    taskDispatcher.init(this.appTasks, demoTaskGraph, {
      enableLogging: true,
    });
    //trigger the task dispatcher
    console.info("startEvent emitted!!")
    taskDispatcher.emitEvent("startEvent");
    taskDispatcher.emitEvent("startLogging");
  }

  private platformExtension() {
    // 'mp3'
    return `${Application.android ? 'm4a' : 'caf'}`;
  }

  initializeAppTasks(){
    this.appTasks =  [
      new SimpleTask("record", ({ log, onCancel, remainingTime}) => new Promise(async (resolve) => {
                  log(`Available time: ${remainingTime()}`);
                  this._recorder = new TNSRecorder();
                  this._recorder.debug = true; 

                  const documents = knownFolders.documents();
                  console.log(documents)
                  //const currentApp = knownFolders.currentApp();
                  //console.log(currentApp)

                  var storage = require("nativescript-android-fs");

                  //const audioFolder = currentApp.getFolder('recordings');
                  //const audioFolder = documents.getFolder('audio');
                  //console.log(audioFolder)

                  /*
                  let androidFormat = android.media.MediaRecorder.OutputFormat.MPEG_4;
                  let androidEncoder = android.media.MediaRecorder.AudioEncoder.AAC;
                  */
                  let androidFormat = 2;
                  let androidEncoder = 3;
                  
                  /*
                  const recordingPath = `${
                    audioFolder.path 
                  }/recording.${this.platformExtension()}`;
                  */
                  
                  var timeStamp = Date.now();
                  var fileName = 'AMrecording'+timeStamp+'.mp4'
                  console.log("NAME OF FILE: "+ fileName)
                  const filePath = path.join(documents.path, fileName);

                  const recorderOptions: AudioRecorderOptions = {
                    filename: filePath,
                    //filename: recordingPath,
                    format: androidFormat,
                    encoder: androidEncoder,
                    metering: true,
                    infoCallback: infoObject => {
                      console.log(JSON.stringify(infoObject));
                    },
                    errorCallback: errorObject => {
                      console.log(JSON.stringify(errorObject));
                    }
                  };
                  log("Recording start!");
                  this.message = `Status: Recording`;
                  this._recorder.start(recorderOptions);
                  const timeoutId = setTimeout(() => {
                      log("Recording stop!");
                      this.message = `Status: Recording Break`;
                      this._recorder.stop();

                      //save recording
                      //check if exists in internal storage 
                      const exists = File.exists(filePath); 
                      console.log("FILE EXISTS IN INTERNAL: " + exists)
                      //check if exists in external storage
                      storage.save("/Download",fileName);
                      console.log("FILE EXISTS IN EXTERNAL: "+storage.check("/Download",fileName))
                      resolve();
                  }, 10000); //record for 10 seconds, don't think so: check again

                  onCancel(() => {
                      clearTimeout(timeoutId);
                      resolve();
                  });
              })
      ),

      new SimpleTask("logToFile", ({ log, onCancel, remainingTime}) => new Promise(async (resolve) => {
        console.log("Logging Device Stats -----------> ")
        console.log(this._logFile) 
        var documents = knownFolders.documents()
        var fileName = "audioMothLog.txt"
        const filePath = path.join(documents.path, fileName);
        //check if exists in internal storage 
        const exists = File.exists(filePath); 
        console.log("FILE EXISTS IN INTERNAL: " + exists)
        //check if exists in external storage
        var storage = require("nativescript-android-fs");
        //storage.save('/storage/emulated/0',fileName);
        //console.log("FILE EXISTS IN EXTERNAL: "+storage.check('/storage/emulated/0',fileName))
        
        /*
        //battery info
        let power = require("nativescript-powerinfo");
        power.startPowerUpdates(function(Info) {
        console.log("battery charge: " + Info.percentage + "%");
        });

        //gps location 
        //npm install geolocation
        
        geolocation.enableLocationRequest();
        console.log("GPS location: " + geolocation.getCurrentLocation({ 
          desiredAccuracy: CoreTypes.Accuracy.high, maximumAge: 5000, timeout: 20000
         }))
         
        //internal temp
        
        const activity: App.Activity = Application.android.startActivity || Application.android.foregroundActivity;
        const mSensorManager = activity.getSystemService(
          android.content.Context.SENSOR_SERVICE) as android.hardware.SensorManager;
        const mTempSensor = mSensorManager.getDefaultSensor(
          android.hardware.Sensor.TYPE_AMBIENT_TEMPERATURE
        );
        console.log("Internal Temperature: " + mTempSensor)
        */

        })
      ),          
    ];
  }

  stop() {
    console.info("stopEvent emitted!!")
    taskDispatcher.emitEvent("stopEvent");

    this.message = `Status: Waiting to Start`
    this.startBtnStatus = 'true';
    this.stopBtnStatus = 'false';
  }
  
  

}
