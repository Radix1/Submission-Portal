import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  // message;
  // messageClass;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(30), // Maximum length is 30 characters
        this.validateEmail // Custom validation
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
      username: ['', Validators.required],
      confirm: ['', Validators.required],
      college: ['', Validators.required],
      year: ['', Validators.required],
      contact: ['', Validators.required] 
    }, { validator: this.matchingPasswords('password', 'confirm')});
  }



  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true }; // Return as invalid email
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true }; // Return as error: do not match
      }
    };
  }
  onSignupSubmit() {

    const user = {
      username: this.form.get('username').value,
      email: this.form.get('email_id').value,
      name: this.form.get('name').value,
      college: this.form.get('college').value,
      password: this.form.get('password').value,
      year: this.form.get('year').value,
      contact: this.form.get('contact').value
    };
    this.authService.registerUser(user).subscribe(data => {
      if (!data.success) {
        console.log(data.msg);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
