import { Component, OnInit } from '@angular/core';
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
  errorMessage = '';

  constructor(
    private warehouseService: WarehouseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.warehouseId = Number(id);
      this.isEditMode = true;
      this.loadWarehouse(this.warehouseId);
    }
  }

  loadWarehouse(id: number): void {
  this.warehouseService.getWarehouseById(id).subscribe({
    next: (data) => {
      this.warehouse = {
        ...data
      };
    }
  });
}
  getUsedPercentage(): number {
    if (!this.warehouse.capacity || this.warehouse.capacity === 0) {
      return 0;
    }

    return Math.round((this.warehouse.currentCapacity / this.warehouse.capacity) * 100);
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
        next: () => this.router.navigate(['/warehouses'])
      });
    } else {
      this.warehouseService.addWarehouse(this.warehouse).subscribe({
        next: () => this.router.navigate(['/warehouses'])
      });
    }
  }
}