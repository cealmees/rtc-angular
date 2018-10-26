import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
const RecordRTC = require('recordrtc/RecordRTC.min');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  isDisabled;
  @ViewChild('audio') audioPlayerRef;

  public streamSource: any;
  public recordRTC: any;
  video;

  async ngAfterViewInit() {
    // set the initial state of the video
    const video: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;

    this.streamSource = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recordRTC = RecordRTC(this.streamSource, {
      bitsPerSecond: 128000,
      bufferSize: 256,
      numberOfAudioChannels: 1,
      recorderType: RecordRTC.StereoAudioRecorder,
      mimeType: 'audio/mp3'
    });
  }


  recordAudio(): Promise<any> {
    return new Promise(resolve => {
      this.recordRTC.startRecording();
    });
  }

  stopRecordAudio(): Promise<any> {
    return new Promise(resolve => {
      this.recordRTC.stopRecording(audioURL => {
        const recordedBlob = this.recordRTC.getBlob();
      });
    });
    console.log(this.recordRTC);
  }

  download() {
    this.recordRTC.save('video.wav');
    console.log(this.recordRTC);
  }

}
