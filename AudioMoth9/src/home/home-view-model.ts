

import { Observable } from '@nativescript/core'
import { SelectedPageService } from '../shared/selected-page-service'
import {
  Application,Dialogs,File,isAndroid,knownFolders,
  Page,Slider,Utils,CoreTypes,path,
} from '@nativescript/core';
import { Task, SimpleTask } from "nativescript-task-dispatcher/tasks";
import { DemoTaskGraph } from "../tasks/graph";
import { taskDispatcher } from "nativescript-task-dispatcher";
import {
  AudioRecorderOptions,
  TNSRecorder
} from 'nativescript-audio';

import * as geolocation from '@nativescript/geolocation';
CoreTypes.Accuracy; // used to describe at what accuracy the location should be get
import { DeviceInfo } from "nativescript-dna-deviceinfo";

import { AndroidSensors, AndroidSensorListener, SensorDelay } from 'nativescript-android-sensors';
import { android } from '@nativescript/core/application';

export class HomeViewModel extends Observable {
  constructor() {
    super()
    this.message = `Status: Waiting to Start`;
    this.startBtnStatus = 'true';
    this.stopBtnStatus = 'false';
    this.numRecordings = "";
    //var documents = knownFolders.documents();
    var timeStamp = Date.now();
    this.logFile = 'audioMothLog'+timeStamp+'.txt'

    
    SelectedPageService.getInstance().updateSelectedPage('Home')
  }

  private _recorder: TNSRecorder;
  private _message: string
  private _numRecordings: string
  private _startBtnStatus: string
  private _stopBtnStatus: string
  private appTasks: Array<Task>
  private counter: number
  private logFile: string
  

  get message(): string {
    return this._message
  }

  set message(value: string) {
    if (this._message !== value) {
      this._message = value
      this.notifyPropertyChange('message', value)
    }
  }
  get numRecordings(): string {
    return this._numRecordings
  }

  set numRecordings(value: string) {
    if (this._numRecordings !== value) {
      this._numRecordings = value
      this.notifyPropertyChange('numRecordings', value)
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
    this.counter = 0;
    geolocation.enableLocationRequest();
        
    //initialize appTask
    this.initializeAppTasks();

    //initialise demoTaskGraph
    var demoTaskGraph = new DemoTaskGraph(1);//record every 1 min 

    //load taskgraph
    taskDispatcher.init(this.appTasks, demoTaskGraph, {
      enableLogging: true,
    });

    //gps location 
    //gps location 
    var p = geolocation.getCurrentLocation({ 
      desiredAccuracy: CoreTypes.Accuracy.high, maximumAge: 5000, timeout: 20000
     })

     var geoloc;
     p.then((value) => {
      geoloc = JSON.stringify(value)
      console.log('LOCATION:'+geoloc);
    }).catch((err) => {
      console.log('LOCATION:'+err); // 👉️ "An error occurred"
    });
         
    const documents = knownFolders.documents();
    const file: File = <File>documents.getFile(this.logFile);

    var data =  "Geolocation: " + p + "\n"
    file.writeTextSync(data,  function(err) {
    if (err) {
      return console.error(err);
      }
    });
    //trigger the task dispatcher
    console.info("startEvent emitted!!")
    taskDispatcher.emitEvent("startEvent");
  }

  private platformExtension() {
    // 'mp3'
    return `${Application.android ? 'm4a' : 'caf'}`;
  }

  initializeAppTasks(){
    this.appTasks =  [
      new SimpleTask("record", ({ log, onCancel, remainingTime}) => new Promise(async (resolve) => {
                  log(`Available time: ${remainingTime()}`);
                  this.counter++;
                  this._recorder = new TNSRecorder();
                  this._recorder.debug = true; 

                  const documents = knownFolders.documents();
                  var storage = require("nativescript-android-fs");

                  /*
                  let androidFormat = android.media.MediaRecorder.OutputFormat.MPEG_4;
                  let androidEncoder = android.media.MediaRecorder.AudioEncoder.AAC;
                  */
                  let androidFormat = 2;
                  let androidEncoder = 3;
                  var timeStamp = Date.now();
                  var fileName = 'AMrecording'+timeStamp+'.mp4'
                  console.log("NAME OF FILE: "+ fileName)
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
                      const exists = File.exists(filePath); 
                      console.log("FILE EXISTS IN INTERNAL: " + exists)
                      storage.save("/Downloads",fileName)
                      console.log("FILE EXISTS IN EXTERNAL: "+storage.check("/Downloads",fileName))
                      if (exists){
                      this.numRecordings = "# of Recordings:  " + this.counter.toString(); 
                      }
                      resolve();
                  }, 10000); //record for 10 seconds, don't think so: check again

                  onCancel(() => {
                      clearTimeout(timeoutId);
                      resolve();
                  });
              })
      ),

      new SimpleTask("logToFile", ({ log, onCancel, remainingTime}) => new Promise( (resolve) => {
        console.log("Logging Device Stats -----------> ");
        //console.log(this._logFile);
        var time = Date.now()
        console.log("Timestamp: " + time);

        //battery level
        console.log("Battery Level: "+ DeviceInfo.batteryLevel() +"%");

        const activity: android.app.Activity= Application.android.startActivity
        const mSensorManager = activity.getSystemService(
          //android.content.Context.SENSOR_SERVICE) as android.hardware.SensorManager;
          "sensor") as android.hardware.SensorManager;

        //internal temperature sensor
        const mTempSensor = mSensorManager.getDefaultSensor(
            //android.hardware.Sensor.TYPE_TEMPERATURE (7)
            // ambient --> 13
            13
        );
        
        console.log("Internal Temperature: " + mTempSensor)
        //light  sensor
        const mLightSensor = mSensorManager.getDefaultSensor(
            //android.hardware.Sensor.TYPE_LIGHT
            5
        );
        console.log("Ambient Light: " + mLightSensor)

        //pressure   
        const mPressureSensor = mSensorManager.getDefaultSensor(
          //android.hardware.Sensor.TYPE_PRESSURE
          6
        );
        console.log("Pressure: " + mPressureSensor)

        const documents = knownFolders.documents();
        const file: File = <File>documents.getFile(this.logFile);
        var contents = file.readTextSync(function(err) {
          if (err) {
              return console.error(err);
          }
        });
        console.log("CONTENTS:" + contents)

        var data = contents + "Timestamp: " + time + "\n"
        data += "Battery Level: "+ DeviceInfo.batteryLevel() +"%\n"
        data += "Ambient Light: " + mLightSensor + "\n"
        
        console.log("DATA: " + data)
        file.writeTextSync(data,  function(err) {
          if (err) {
              return console.error(err);
          }
        });

        resolve();
        onCancel(() => {
          resolve();
        });
        })
      ),          
    ];
  }

  stop() {
    console.info("stopEvent emitted!!")
    taskDispatcher.emitEvent("stopEvent");
    this.message = `Refresh App to Start Again`
    this.stopBtnStatus = 'false';
  }
  
  
  

}
