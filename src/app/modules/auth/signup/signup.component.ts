import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, debounceTime, filter, retry } from 'rxjs';
import { UserData } from './models/auth.model';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  subscription = new Subscription()
  signupForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  })

  users: UserData[] = []
  selectedUser!: UserData

  constructor(private authService: AuthService, private toast: ToastrService) {

  }

  ngOnInit() {
    this.mobileChanged()
  }

  mobileChanged() {
    this.subscription.add(
      this.signupForm.get('mobile')?.valueChanges
        .pipe(
          filter((val: any) => (val?.trim().length > 2)),
          debounceTime(700),
          retry(-1)
        )
        .subscribe((data) =>
          this.signupForm.get('mobile')?.valid ? this.getMobileNumbers(data) : null
        )
    );
  }

  getMobileNumbers(text: string) {
    this.subscription.add(
      this.authService.getUsersPhons(text).subscribe((res: any) => {
        this.users = res
      })
    )
  }

  splitMobileNumber(user: UserData) {
    this.selectedUser = user
    return user.contactNo.split(';')[1]
  }

  onSelectPhone() {
    this.signupForm.patchValue(this.selectedUser)
  }

  signup() {
    const body = {
      fullname: `${this.signupForm.get('firstName')?.value} ${this.signupForm.get('lastName')?.value}`,
      mobile: this.signupForm.get('mobile')?.value
    }
    this.subscription.add(
      this.authService.signup(body).subscribe(
        {
          next: (res: any) => {
            this.toast.success('Added Successfully')
          },
        }
      )
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
