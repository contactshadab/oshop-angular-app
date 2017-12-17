import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CategoryService } from '../../category.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {

  @Input('category') category;

  categories$: Observable<any[]>;

  constructor(categoryService: CategoryService) { 
    this.categories$ = categoryService.getAll();
  }

}
