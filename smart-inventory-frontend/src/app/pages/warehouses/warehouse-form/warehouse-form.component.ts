import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Warehouse, WarehouseService } from '../../../services/warehouse.service';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './warehouse-form.component.html',
  styleUrl: './warehouse-form.component.css'
})
export class WarehouseFormComponent implements OnInit {
  warehouse: Warehouse = {
    warehouseName: '',
    location: '',
    capacity: 0,
    currentCapacity: 0
  };

  warehouseId: number | null = null;
  isEditMode = false;
  loading = false;
  errorMessage = '';

  constructor(
    private warehouseService: WarehouseService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.warehouseId = Number(id);
        this.isEditMode = true;
        this.loadWarehouse(this.warehouseId);
      }
    });
  }

  loadWarehouse(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.warehouseService.getWarehouseById(id).subscribe({
      next: (data) => {
        this.warehouse = {
          id: data.id,
          warehouseName: data.warehouseName || '',
          location: data.location || '',
          capacity: Number(data.capacity || 0),
          currentCapacity: Number(data.currentCapacity || 0),
          createdAt: data.createdAt
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('WAREHOUSE LOAD ERROR:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getUsedPercentage(): number {
    if (!this.warehouse.capacity || this.warehouse.capacity === 0) {
      return 0;
    }

    return Math.round(
      ((this.warehouse.currentCapacity || 0) / this.warehouse.capacity) * 100
    );
  }

  saveWarehouse(): void {
    this.errorMessage = '';

    if (!this.warehouse.warehouseName.trim()) {
      this.errorMessage = 'Warehouse name is required';
      return;
    }

    if (this.warehouse.capacity <= 0) {
      this.errorMessage = 'Capacity must be greater than 0';
      return;
    }

    if (this.warehouse.currentCapacity < 0) {
      this.errorMessage = 'Current capacity cannot be negative';
      return;
    }

    if (this.warehouse.currentCapacity > this.warehouse.capacity) {
      this.errorMessage = 'Current capacity cannot be bigger than total capacity';
      return;
    }

    if (this.isEditMode && this.warehouseId) {
      this.warehouseService.updateWarehouse(this.warehouseId, this.warehouse).subscribe({
        next: () => this.router.navigate(['/warehouses']),
        error: (error) => {
          console.error('WAREHOUSE UPDATE ERROR:', error);
          this.errorMessage = 'Failed to update warehouse';
        }
      });

      return;
    }

    this.warehouseService.addWarehouse(this.warehouse).subscribe({
      next: () => this.router.navigate(['/warehouses']),
      error: (error) => {
        console.error('WAREHOUSE ADD ERROR:', error);
        this.errorMessage = 'Failed to save warehouse';
      }
    });
  }
}