# React Project for PCT Tracker Website

This folder contains the source code for the PCT Tracker Website. It was bootstrapped using Create-React-App with Typescript.

The src folder is split into the following three main subfolders: 
1. Components: This is were all the React components are defined. Attempts were made to make these components reusable as best as possible.
1. Pages: This is where each webpage is defined, reference React components as needed.
1. Services: This is where underlying website logic is defined to handle login and data requests.

There is also a scripts folder containing scripts for deploying the web app. 

**IMPORTANT**: Do not try to deploy using normal Create-React-App commands. This project is meant to be deployed in tandem with the CDK stack contained in this repo and so should only be deployed following the deployment instructions found in the main README. Otherwise it will likely crash.

