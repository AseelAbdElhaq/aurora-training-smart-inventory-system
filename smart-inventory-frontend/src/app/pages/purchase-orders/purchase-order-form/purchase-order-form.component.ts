import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SupplierService, Supplier } from '../../../services/supplier.service';
import { ProductService, Product } from '../../../services/product.service';
import { WarehouseService } from '../../../services/warehouse.service';
import {
  PurchaseOrder,
  PurchaseOrderService
} from '../../../services/purchase-order.service';

@Component({
  selector: 'app-purchase-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchase-order-form.component.html',
  styleUrl: './purchase-order-form.component.css'
})
export class PurchaseOrderFormComponent implements OnInit {
  form!: FormGroup;

  suppliers: Supplier[] = [];
  warehouses: any[] = [];
  products: Product[] = [];

  orderId: number | null = null;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private purchaseOrderService: PurchaseOrderService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.orderId = Number(this.route.snapshot.paramMap.get('id')) || null;

    this.loadDropdowns();

    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      supplierId: ['', Validators.required],
      warehouseId: ['', Validators.required],
      items: this.fb.array([])
    });

    this.addItem();
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
    this.cdr.detectChanges();
  }

  removeItem(index: number): void {
    if (this.items.length === 1) return;

    this.items.removeAt(index);
    this.cdr.detectChanges();
  }

  loadDropdowns(): void {
    this.supplierService.getSuppliers().subscribe({
      next: data => {
        this.suppliers = [...(data || [])];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Suppliers load error:', error);
        this.suppliers = [];
        this.cdr.detectChanges();
      }
    });

    this.productService.getProducts().subscribe({
      next: data => {
        this.products = [...(data || [])];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Products load error:', error);
        this.products = [];
        this.cdr.detectChanges();
      }
    });

    this.warehouseService.getWarehouses().subscribe({
      next: data => {
        this.warehouses = [...(data || [])];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Warehouses load error:', error);
        this.warehouses = [];
        this.cdr.detectChanges();
      }
    });
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.purchaseOrderService.getOrderById(id).subscribe({
      next: order => {
        this.form.patchValue({
          supplierId: order.supplier?.id || '',
          warehouseId: order.warehouse?.id || ''
        });

        this.items.clear();

        for (const item of order.items || []) {
          this.items.push(
            this.fb.group({
              productId: [item.product?.id || '', Validators.required],
              quantity: [item.quantity || 1, [Validators.required, Validators.min(1)]],
              unitPrice: [item.unitPrice || 0, [Validators.required, Validators.min(0)]]
            })
          );
        }

        if (this.items.length === 0) {
          this.addItem();
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Purchase order load error:', error);
        this.loading = false;
        this.cdr.detectChanges();
        alert('Failed to load purchase order');
      }
    });
  }

  onProductChange(index: number): void {
    const row = this.items.at(index);
    const productId = Number(row.get('productId')?.value);

    const product = this.products.find(p => Number(p.id) === productId);

    if (product) {
      row.patchValue({
        unitPrice: Number(product.price) || 0
      });
    }

    this.cdr.detectChanges();
  }

  getItemTotal(index: number): number {
    const row = this.items.at(index);

    const quantity = Number(row.get('quantity')?.value) || 0;
    const unitPrice = Number(row.get('unitPrice')?.value) || 0;

    return quantity * unitPrice;
  }

  getGrandTotal(): number {
    return this.items.controls.reduce((sum, _, index) => {
      return sum + this.getItemTotal(index);
    }, 0);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.saving = true;
    this.cdr.detectChanges();

    const value = this.form.value;

    const order: PurchaseOrder = {
      supplier: {
        id: Number(value.supplierId),
        supplierName: ''
      },
      warehouse: {
        id: Number(value.warehouseId),
        warehouseName: ''
      },
      items: value.items.map((item: any) => ({
        product: {
          id: Number(item.productId),
          productName: '',
          sku: '',
          price: Number(item.unitPrice)
        },
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      }))
    };

    const request = this.orderId
      ? this.purchaseOrderService.updateOrder(this.orderId, order)
      : this.purchaseOrderService.createOrder(order);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/purchase-orders']);
        });
      },
      error: error => {
        console.error('Save purchase order error:', error);
        this.saving = false;
        this.cdr.detectChanges();
        alert(error.error || 'Failed to save purchase order');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/purchase-orders']);
  }
}