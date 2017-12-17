import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ShoppingCartService } from '../shopping-cart.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService) {

  }

  async ngOnInit(){
    this.cart$ = (await this.cartService.getCart());

    this.populateCart();
  }

  private populateCart(){
    this.productService.getAll()
    .switchMap(products => {
      this.products = products;

      return this.route.queryParamMap;
    })
    .subscribe(params => {
      this.category = params.get('category');
      this.applyFilter();
    });
  }

  private applyFilter(){
    this.filteredProducts = (this.category) ?
      this.products.filter(p => p.category == this.category) :
      this.products;
  }

}
