import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent {
  public modalLogOutVisible: boolean = false;

  public showLogOutModal(): void {
    this.modalLogOutVisible = true;
  }

  public hideLogOutModal(): void {
    this.modalLogOutVisible = false;
  }

  public saveLogOutChanges(): void {
    localStorage.removeItem("access_token");
    this.modalLogOutVisible = false;
  }
}
