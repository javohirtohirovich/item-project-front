import { CommonModule } from '@angular/common';
import { Component,  OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../services/models/item/item';
import { FormsModule } from '@angular/forms';
import { ItemCreate } from '../../services/models/item/itemCreate';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit {
  public modalDeleteVisible: boolean = false;
  public modalEditVisible: boolean=false;
  public modalAddVisible: boolean=false;
  private itemService:ItemService=inject(ItemService);
  public items:Item[]=[];

  public itemType: number = 0;
  public itemName: string = "";
  public itemDate: Date =new Date();
  //Get Item
  public ngOnInit(): void {
      this.itemService.getItems()
        .subscribe(x=>{
          this.items=x;
        });
  }

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
    const itemCreateModel = new ItemCreate();        
        itemCreateModel.itemName=this.itemName;
        itemCreateModel.itemType=this.itemType;
        itemCreateModel.itemDate=this.itemDate;
    this.itemService.addItem(itemCreateModel);
    this.modalAddVisible = false;
  }

  

}
