import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from './models/product';
import { AngularFireObject } from 'angularfire2/database/interfaces';
import { ShoppingCartItem } from './models/shopping-cart-item';
import { ShoppingCart } from './models/shopping-cart';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>>{
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges()
      .map(cart => new ShoppingCart(cart['items']))
  }

  async addToCart(product: Product){
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product){
    this.updateItem(product, -1);
  }

  async clearCart(){
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }
  
  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string){
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string>{
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key);    
    return result.key;
  }

  private async updateItem(product: Product, increaseBy: number){
    let cartId = await this.getOrCreateCartId();
    
    let itemRef = this.getItem(cartId, product.key);
    itemRef.snapshotChanges().take(1).subscribe(item => {
      console.log(item.payload.val());
      let quantity = item.key? item.payload.val().quantity + increaseBy: 1;
      if(quantity === 0) itemRef.remove();
      else{  
        itemRef.update({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: quantity
        })
      }
    })
  }

}
