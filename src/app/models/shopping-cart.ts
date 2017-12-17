import { ShoppingCartItem } from "./shopping-cart-item";
import { Product } from "./product";


export class ShoppingCart{
    
    items: ShoppingCartItem[] = [];

    constructor(private itemsMap: { [productId: string]: ShoppingCartItem} ){
        this.itemsMap = itemsMap || {};

        for(let productId in this.itemsMap){
            let item = this.itemsMap[productId];
            this.items.push(new ShoppingCartItem({ ...item, key: productId }));
        }
    }

    get totalItemsCount() {
        let count: number = 0;
        
        for(let itemId in this.items)
            count += this.items[itemId].quantity;      
        return count;  
    }

    get totalPrice(){
        let sum = 0;
        for(let productId in this.items)
            sum += this.items[productId].totalPrice;
        
        return sum;
    }

    getQuantity(product: Product){
        //if (this.items.length === 0) return 0;
        
        let item = this.itemsMap[product.key];
        return item? item.quantity: 0;
    }
}