#!/bin/bash
cd src-cordova/platforms/android/app/build/outputs/apk/release/
apkname=dtp-`git rev-parse --short HEAD`.apk
cp app-release-unsigned.apk $apkname
jarsigner -verbose -keystore `git rev-parse --show-toplevel`/dtp-front/dtp.keystore $apkname dtp
zipalign -c 4 $apkname
echo "-- Done !"
xdg-open .
