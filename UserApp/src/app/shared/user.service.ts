import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private formBuilder:FormBuilder,
    private http:HttpClient) { }

  readonly baseUri = 'https://localhost:44310/api'; 

  formModel = this.formBuilder.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })
  });

  comparePasswords(formBuilder: FormGroup){
    let confirmPassword = formBuilder.get('ConfirmPassword');

    if(confirmPassword?.errors == null || 'passwordMismatch' in confirmPassword.errors){
      if(formBuilder.get('Password')?.value != confirmPassword?.value){
        confirmPassword?.setErrors({ passwordMismatch: true });
      }
      else{
        confirmPassword?.setErrors(null);
      }
    }
  }

  register(){
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };

    return this.http.post(`${this.baseUri}/User/Register`, body);
  }

  login(formData:any){
    return this.http.post(`${this.baseUri}/User/Login`, formData);
  }

  getUserProfile(){
    return this.http.get(`${this.baseUri}/UserProfile`);
  }

  roleMatch(allowedRoles: any) : boolean {
    var isMatch = false;
    var token = localStorage.getItem('token');
    if(token != null){
      var payLoad = JSON.parse(window.atob(token.split('.')[1]));
      var userRole = payLoad["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      allowedRoles.forEach((element:any) : any => {
        if(userRole == element){
          isMatch = true;
          return false;
        }
      });
    }
    return isMatch;
  }
}