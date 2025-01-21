import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/services/userService/users.service';

@Component({
  selector: 'app-signatues-list',
  templateUrl: './signatues-list.component.html',
  styleUrls: ['./signatues-list.component.css']
})
export class SignatuesListComponent implements OnInit {
  signatureForm!: FormGroup
  formData: any = {}
  fileTouched = false; // Track if file input is touched
  constructor(private userServ: UsersService) { }

  ngOnInit(): void {
  }
  onSubmit() {
    console.log(this.formData);
    this.userServ.addSignature(this.formData).subscribe(
      (res) => {
        console.log(res.msg);
      }
    )
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileTouched = true; // Mark file input as touched
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (file.type !== 'image/svg+xml') {
        alert('Only SVG files are allowed.');
        input.value = ''; // Clear the input
        this.formData.signatureFile = null;
        return;
      }

      this.formData.signatureFile = file; // Store the selected file
    } else {
      this.formData.signatureFile = null; // Reset if no file selected
    }
  }

}
