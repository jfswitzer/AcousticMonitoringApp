import { Observable } from '@nativescript/core'
import { SelectedPageService } from '../shared/selected-page-service'
import { MediaRecorder } from 'extendable-media-recorder';
import {
  Application,
  Dialogs,
  File,
  isAndroid,
  knownFolders,
  Page,
  Slider,
  Utils,
  CoreTypes,
} from '@nativescript/core';
//old verison of Nativescript 
//import { knownFolders, Folder, File } from "tns-core-modules/file-system";
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
  */
  private _recorder: TNSRecorder;
  private _message: string
  private _startBtnStatus: string
  private _stopBtnStatus: string
  private _logFile: File; 


  /*
  private dur: number
  private freq: number 
  */

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
    var demoTaskGraph = new DemoTaskGraph(1);//record every 60 seconds 

    //load taskgraph
    taskDispatcher.init(this.appTasks, demoTaskGraph, {
      enableLogging: true,
    });
    //trigger the task dispatcher
    console.info("startEvent emitted!!")
    this.emitStartEvent();

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
                  const audioFolder = documents.getFolder('audio');
                  console.log(audioFolder)

                  /*
                  let androidFormat = android.media.MediaRecorder.OutputFormat.MPEG_4;
                  let androidEncoder = android.media.MediaRecorder.AudioEncoder.AAC;
                  */
                  let androidFormat = 2;
                  let androidEncoder = 3;
                  //const emulatedPath: string = "/storage/emulated/0/recording"
                  /*
                  const recordingPath = `${
                    audioFolder.path 
                     //emulatedPath
                  }/recording.${this.platformExtension()}`;
                  */

                  //console.log(JSON.stringify(audioFolder));
                  
                  
                  //const recordingPath= "/storage/emulated/0/recording"
                  //console.log(recordingPath)
                  
                  var timeStamp = Date.now();

                  const recorderOptions: AudioRecorderOptions = {
                    filename: audioFolder.path+'AMrecording'+timeStamp+'.mp4',
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
                      resolve();
                  }, 10000); //record for 10 seconds
                  storage.save("/storage/emulated/0/audioMothRecordings","AMrecording"+timeStamp+".mp4");

                  onCancel(() => {
                      clearTimeout(timeoutId);
                      resolve();
                  });
              })
      ),

      new SimpleTask("logToFile", ({ log, onCancel, remainingTime}) => new Promise(async (resolve) => {
        console.log("Logging Device Stats -----------> ")
        console.log(this._logFile) 
        this._logFile.writeText("Something")
        /*
        //battery infot 
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
  
  async emitStartEvent() {
    const isReady = await taskDispatcher.isReady();
    if (!isReady) {
      const tasksNotReady = await taskDispatcher.tasksNotReady;
      console.log(`The following tasks are not ready!: ${tasksNotReady}`);
      await taskDispatcher.prepare();
    }
    taskDispatcher.emitEvent("startEvent");
  }
}
