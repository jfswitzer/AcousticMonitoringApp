

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
import * as geolocation from "nativescript-geolocation";

export class HomeViewModel extends Observable {
  constructor() {
    super()
    this.message = `Status: Waiting to Start`;
    this.startBtnStatus = 'true';
    this.stopBtnStatus = 'false';

    var documents = knownFolders.documents();
    var timeStamp = Date.now();
    var fileName = 'audioMothLog'+timeStamp+'.txt'
    this._logFile = documents.getFile(fileName);


    SelectedPageService.getInstance().updateSelectedPage('Home')
  }

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
  


  onTap() {
    this.message = `Status: Preparing task dispatcher`;
    this.startBtnStatus = 'false';
    this.stopBtnStatus = 'true';

    //initialize appTask
    this.initializeAppTasks();

    //initialise demoTaskGraph
    var demoTaskGraph = new DemoTaskGraph(1);//record every 1 min 

    //load taskgraph
    taskDispatcher.init(this.appTasks, demoTaskGraph, {
      enableLogging: true,
    });
/*
    //gps location 
        //npm install geolocation
        
        geolocation.enableLocationRequest();
        console.log("GPS location: " + geolocation.getCurrentLocation({ 
          desiredAccuracy: CoreTypes.Accuracy.high, maximumAge: 5000, timeout: 20000
         }))
         */
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
                  //console.log(documents)
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
                  
                  
                  
                  var timeStamp = Date.now();
                  var fileName = 'AMrecording'+timeStamp+'.mp4'
                  console.log("NAME OF FILE: "+ fileName)
                  /*
                  //ask for permissions 
                  const permissions = require('nativescript-permissions')
                  permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                  .then(() => {
                  console.log('Required Android permissions have been granted');
                  })
                  .catch(() => {
                  console.error('Required Android permissions have been denied!');
                  });
                  */
                  

                  const filePath = path.join(documents.path, fileName);
                  console.log(filePath);

                  console.log(Application.android.context.getFilesDir())

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
                      //storage.save("/Downloads",fileName)
                      console.log("FILE EXISTS IN EXTERNAL: "+storage.check("/Downloads",fileName))

                      resolve();
                  }, 10000); //record for 10 seconds, don't think so: check again

                  onCancel(() => {
                      clearTimeout(timeoutId);
                      resolve();
                  });
              })
      ),

      new SimpleTask("logToFile", ({ log, onCancel, remainingTime}) => new Promise(async (resolve) => {
        console.log("Logging Device Stats -----------> ");
        console.log(this._logFile);
        //not working 
        (this._logFile).writeText("This is a test");
        
        
        /*
        //battery info
        var power = require("nativescript-powerinfo");
        power.startPowerUpdates(function(Info) {
        console.log("battery charge: " + Info.percentage + "%");
        });
        */
  

        //gps location 
        //npm install geolocation
        
        geolocation.enableLocationRequest();
        
        
        console.log("GPS location: " + geolocation.getCurrentLocation({ 
          desiredAccuracy: CoreTypes.Accuracy.high, maximumAge: 5000, timeout: 20000
         }))
         
         /*
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
