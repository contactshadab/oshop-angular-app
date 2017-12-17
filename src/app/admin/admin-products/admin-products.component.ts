import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../product.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { Product } from './../../models/product';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  products: Product[];
  subscription: Subscription;
  tableResource: DataTableResource<Product>;
  items: Product[] = [];
  itemCount: number = 0;

  constructor(private productService: ProductService) {
    this.subscription = this.productService.getAll()
      .subscribe(products => {
        this.products = products;
        this.initializeTable(products);
      })
  }

  private initializeTable(products: Product[]){
    this.tableResource = new DataTableResource(products);
    this.tableResource.query({
      offset: 0,
      limit: 10
    })
      .then(value => this.items = value);
    this.tableResource.count()
      .then(count => this.itemCount = count);
  }

  reloadItems(params){
    if(!this.tableResource)
      return;

    this.tableResource.query(params)
      .then(value => this.items = value);;
  }

  filter(query){
    console.log(query);
    let filteredProducts = (query) ?
      this.products.filter(product => product.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
    
    this.initializeTable(filteredProducts);
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
