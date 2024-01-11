import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditComponent } from '../modal/edit/edit.component';
import { AddItemComponent } from '../modal/add-item/add-item.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,EditComponent,AddItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  public modalDeleteVisible: boolean = false;
  public modalEditVisible: boolean=false;
  public modalAddVisible: boolean=false;

  //Delete Modal Function
  public showDeleteModal(): void {
    this.modalDeleteVisible = true;
  }

  public hideDeleteModal(): void {
    this.modalDeleteVisible = false;
  }

  public saveDeleteChanges(): void {
    // do something
    this.modalDeleteVisible = false;
  }

  //Edit Modal Function
  public showEditModal(): void {
    this.modalEditVisible = true;
  }

  public hideEditModal(): void {
    this.modalEditVisible = false;
  }

  public saveEditChanges(): void {
    // do something
    this.modalEditVisible = false;
  }

  //Add Modal Function
  public showAddModal(): void {
    this.modalAddVisible = true;
  }

  public hideAddModal(): void {
    this.modalAddVisible = false;
  }

  public saveAddChanges(): void {
    // do something
    this.modalAddVisible = false;
  }

  

}
