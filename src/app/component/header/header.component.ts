import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationOrchestrator } from '../models/authentication-orchestrator';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent implements OnInit {
  private router: Router = inject(Router);

  public modalLogOutVisible: boolean = false;
  public isLoggedIn: boolean = false;


  //Modal LogOut Function
  public showLogOutModal(): void {
    this.modalLogOutVisible = true;
  }

  public hideLogOutModal(): void {
    this.modalLogOutVisible = false;
  }

  public ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.router.navigate(['/home']);
      this.isLoggedIn = true;
    }
    AuthenticationOrchestrator.signaller.subscribe((x) => {
      this.isLoggedIn = x;
    });
  }
  //Check Token
  public check_token():void{
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }


  public saveLogOutChanges(): void {
    localStorage.removeItem('access_token');
    this.isLoggedIn = false;
    AuthenticationOrchestrator.signaller.next(false);
    this.check_token();
    this.modalLogOutVisible = false;
  }
}
