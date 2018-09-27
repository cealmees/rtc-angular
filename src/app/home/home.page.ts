import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
const RecordRTC = require('recordrtc/RecordRTC.min');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  isDisabled;
  @ViewChild('audioOption') audioPlayerRef;

  stream;
  video;
  recordRTC;

  ngAfterViewInit() {
    // set the initial state of the video
    const video: HTMLVideoElement = this.audioPlayerRef.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }


  recordAudio(): Promise<any> {
    return new Promise(async resolve => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recordRTC = RecordRTC(stream, {
        recorderType: RecordRTC.StereoAudioRecorder,
        mimeType: 'audio/wav'
      });

      recordRTC.startRecording();
      recordRTC.stopRecording(function (audioURL) {
        this.audioRecorded = audioURL;

        const recordedBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function (dataURL) { });
      });

    });
  }

  onRecordingStart() {
    const mediaConstraints = {
      recorderType: RecordRTC.StereoAudioRecorder,
      mimeType: 'audio/wav'
    };
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(this.successCallback.bind(this), error => console.log(error));

  }
  stopRecording() {
    const recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    const stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
  }
  successCallback(stream: MediaStream) {
    const options = {
      recorderType: RecordRTC.StereoAudioRecorder,
      mimeType: 'audio/wav'
    };

    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    const video: HTMLVideoElement = this.video.nativeElement;
    video.src = window.URL.createObjectURL(stream);
    this.toggleControls();
  }

  toggleControls() {
    const video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  processVideo(audioVideoWebMURL) {
    const video: HTMLVideoElement = this.video.nativeElement;
    const recordRTC = this.recordRTC;
    video.src = audioVideoWebMURL;
    this.toggleControls();
    const recordedBlob = recordRTC.getBlob();
    recordRTC.getDataURL(function (dataURL) { });
  }
  download() {
    this.recordRTC.save('video.wav');
  }

}
