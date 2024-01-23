import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRegister } from '../../services/models/user/userRegister';
import { LoadingComponent } from '../loading/loading.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule, LoadingComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.less',
})
export class RegisterComponent {

    //Konstruktor
    constructor(private toastr: ToastrService) { }

    //Inject UserService and Router
    private userService: UserService = inject(UserService);
    private router: Router = inject(Router);

    //Variables for register
    public userName: string = '';
    public userLastName: string = '';
    public userEmail: string = '';
    public password: string = '';
    public passwordConfirm: string = '';

    //Variables for Error
    public nameError: string = '';
    public lastNameError: string = '';
    public emailError: string = '';
    public passwordError: string = '';
    public passwordErrorConfirm: string = '';

    //Variable for loading
    public loading: boolean = false;

    //Function for register
    public registerUser(): void {

        //Clear errorVariables
        this.resetErrors();

        //Validate LoginForm
        if (!this.validateForm()) {
            return;
        }

        //Loading turn on
        this.loading = true;
        //populate UserRegister with variables
        const userRegister = new UserRegister();
        userRegister.userName = this.userName;
        userRegister.userLastName = this.userLastName;
        userRegister.userEmail = this.userEmail;
        userRegister.password = this.password;

        this.userService.userRegister(userRegister).subscribe({
            next: (response) => {
                this.toastr.success("Successful Register!");
                this.loading = false;
                this.router.navigate(["/login"])
            },
            error: (err) => {
                if (err.status == 403) {
                    this.toastr.warning('Already exsist this email!')
                    this.loading=false;
                }
                else {
                    this.toastr.warning("Error during register!");
                    this.loading = false;
                }
            },
        });

    }

    //Function Validate LoginForm
    private validateForm(): boolean {
        let isValid = true;
        if (!this.userName) {
            this.nameError = 'Name is required!';
            isValid = false
        }

        if (!this.userLastName) {
            this.lastNameError = 'LastName is required!';
            isValid = false
        }

        if (!this.userEmail) {
            this.emailError = 'Email is required!';
            isValid = false;
        } else if (!this.isValidEmail(this.userEmail)) {
            this.emailError = 'Invalid email format!';
            isValid = false;
        }

        if (!this.password) {
            this.passwordError = 'Password is required!';
            isValid = false;
        } else if (!this.isValidPassword(this.password)) {
            this.passwordError = 'Password is not strong!'
            this.toastr.info(`1) At least one uppercase letter (A-Z).</br>
            2) At least one lowercase letter (a-z).</br>
            3) At least one number (0-9).</br>
            4) At least one special character (#, ?, !, @, $, %, ^, &, *, -).</br>
            5) At least 8 characters.`, '', { closeButton: true, timeOut: 7000, progressBar: true, enableHtml: true, positionClass: 'toast-bottom-right', })
            isValid = false;
        }

        if (!this.passwordConfirm) {
            this.passwordErrorConfirm = 'Password Confirm is required!';
            isValid = false;
        } else if (!this.isValidPasswordsMatch(this.password, this.passwordConfirm)) {
            this.passwordErrorConfirm = 'Passwords is not Match!'
            isValid = false;
        }

        return isValid;
    }

    //Function Validate email
    private isValidEmail(email: string): boolean {
        const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        return emailRegex.test(email);
    }

    //Function Validate password
    private isValidPassword(password: string): boolean {
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
        return passwordRegex.test(password);
    }

    //Function Validate Passowrds match
    private isValidPasswordsMatch(password1: string, password2: string): boolean {
        return password1 === password2;
    }

    //FUnction Clear error variables
    private resetErrors(): void {
        this.nameError = '';
        this.lastNameError = '';
        this.passwordErrorConfirm = '';
        this.emailError = '';
        this.passwordError = '';
    }
}
