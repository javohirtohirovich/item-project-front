import { Injectable, inject } from "@angular/core";
import { Observable,map} from "rxjs";
import { ItemApiService } from "../api/item.api-service";
import { ItemModel } from "../api/models/item.model";
import {Item} from "./models/item"

@Injectable({providedIn:"root"})
export class ItemService{
    private itemApiService:ItemApiService=inject(ItemApiService);
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
    public addItem(itemName:string, itemType:number , itemDate:Date | null): Observable<any> {

        const item = new Item();
        item.itemName = itemName;
        item.itemType = itemType;
        item.itemDate = itemDate;
        
        return this.itemApiService.addItem({
            itemDate: item.itemDate?.toISOString() || "",
            itemId: item.itemId,
            itemName: item.itemName,
            itemType: item.itemType
        });
    }
    private toModel(apiModel:ItemModel):Item{
         const result=new Item();
         result.itemName=apiModel.itemName;
         result.itemId=apiModel.itemId;
         result.itemType=apiModel.itemType;
         result.itemDate=new Date(apiModel.itemDate);         
         return result;
    }
}