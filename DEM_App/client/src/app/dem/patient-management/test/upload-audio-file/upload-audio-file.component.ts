import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-audio-file',
  templateUrl: './upload-audio-file.component.html',
  styleUrls: ['./upload-audio-file.component.scss']
})
export class UploadAudioFileComponent {

  @Output() file: EventEmitter<string> = new EventEmitter<string>();

  public formGroup = this.fb.group({
    file: [null, Validators.required]
  });
 
  private fileName;
 
  constructor(private fb: FormBuilder) { }
 
  public onFileChange(event) {
    const reader = new FileReader();
 
    if (event.target.files && event.target.files.length) {
      this.fileName = event.target.files[0].name;

      console.log('Uploaded file name: ', this.fileName);

      const [file] = event.target.files;
      reader.readAsDataURL(file);
     
      reader.onload = () => {
        this.formGroup.patchValue({
          file: reader.result
        });
      };
      
    }
  }
 
  public onSubmit(): void {
    this.file.emit(this.formGroup.get('file').value);
  }

}
