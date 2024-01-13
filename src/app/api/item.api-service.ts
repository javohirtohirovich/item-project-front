import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ItemModel } from "./models/item.model";

@Injectable({ providedIn: "root" })
export class ItemApiService {
    private apiUrl = "https://localhost:7274/Item"; // API manzili

    private client: HttpClient=inject(HttpClient);
    
    public getItems(): Observable<ItemModel[]> {
        return this.client.get<ItemModel[]>(this.apiUrl);
    }
    public addItem(addItem : ItemModel ): Observable<any> {
        return this.client.post(this.apiUrl ,addItem );
    }

}
