import { Injectable, inject } from "@angular/core";
import { Observable,map} from "rxjs";
import { ItemApiService } from "../api/item.api-service";
import { ItemModel } from "../api/models/item/item.model";
import {Item} from "./models/item/item"
import { ItemCreate } from "./models/item/itemCreate";

@Injectable({providedIn:"root"})
export class ItemService{
    
    //Inject ApiService (Repository)
    private itemApiService:ItemApiService=inject(ItemApiService);
    
    //GetAll Items
    public getItems():Observable<Item[]>{
        return this.itemApiService.getItems()
            .pipe(map(x=>{
                const result:Item[]=[];
                for(let i=0;i<x.length;i++){
                    result.push(this.toModel(x[i]));
                }
                return result;
            }));
    }

    //Create Item
    public addItem(itemCreate:ItemCreate): Observable<any> {
        return this.itemApiService.addItem(itemCreate);
    }

    //Delete Item
    public deleteItem(itemId:number):Observable<any>{
        return this.itemApiService.deleteItem(itemId);
    }

    //Edit Item
    public editItem(item:Item):Observable<any>{
        return this.itemApiService.editItem(item);
    }


    //ToModel Function for GetAll
    private toModel(apiModel:ItemModel):Item{
         const result=new Item();
         result.itemName=apiModel.itemName;
         result.itemId=apiModel.itemId;
         result.itemType=apiModel.itemType;
         result.itemDate=new Date(apiModel.itemDate);         
         return result;
    }
}