#!/bin/bash

files1=`grep -rl "currentDomain = 'room-house.com'" ./../pages/`
for f in $files1
do
  sed -i "s/currentDomain = 'room-house.com'/currentDomain = '$1'/g" $f
done

files2=`grep -rl "currentDomain = 'room-house.com'" ../src/`
for f in $files2
do
  sed -i "s/currentDomain = 'room-house.com'/currentDomain = '$1'/g" $f
done
