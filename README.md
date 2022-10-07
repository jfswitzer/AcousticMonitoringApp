# AcousticMonitoringApp
## Directions to start the app 
1. Install [Nativescript](https://docs.nativescript.org/environment-setup.html#windows-android).

2. cd to the appication root directory "AudioMoth9" 

3. Run the following commands to install the required plug-ins: 
   ```
    tns plugin add nativescript-task-dispatcher
    tns plugin add nativescript-dna-deviceinfo
    ns plugin add nativescript-audio
    tns plugin add nativescript-geolocation
   ```
4. Run the following commands to install the app: 
    ```
    ns clean
    ns run android
   ```
## Access files (only works on some devices)
```
cd platform-tools 
adb shell
run-as org.nativescript.AudioMoth9 ls /data/user/0/org.nativescript.AudioMoth9/files 
```


## If gradle error appears when running app

1. create new app 
 ```
    ns create AudioMoth
```
2. Copy the code in the following files:
-  home-view-model.ts
-  home-page.ts
-  AndroidManifest.xml 

3. Copy the 'tasks' folder from this repo into the 'src' directory 
4. install the same plug-ins as before 



   

