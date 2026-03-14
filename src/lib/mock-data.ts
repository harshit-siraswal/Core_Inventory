// Mock data for CoreInventory

export interface Product {
  id: string;
  name: string;
  sku: string;
  unitCost: number;
  onHand: number;
  snapToView: number;
  category: string;
}

export interface Warehouse {
  id: string;
  name: string;
  shortCode: string;
  address: string;
}

export interface Location {
  id: string;
  plant: string;
  shortCode: string;
  warehouseId: string;
  warehouseName: string;
}

export interface Receipt {
  id: string;
  reference: string;
  date: string;
  contact: string;
  effectiveDate: string;
  sourceLocation: string;
  status: "draft" | "validated" | "done";
  products: { productId: string; productName: string; quantity: number }[];
}

export interface Delivery {
  id: string;
  reference: string;
  date: string;
  contact: string;
  effectiveDate: string;
  destinationAddr: string;
  operationType: string;
  status: "draft" | "validated" | "done";
  products: { productId: string; productName: string; quantity: number }[];
}

export interface MoveHistory {
  id: string;
  reference: string;
  date: string;
  product: string;
  from: string;
  to: string;
  quantity: number;
  status: "done" | "pending";
}

export const products: Product[] = [
  { id: "1", name: "Steel Rod", sku: "STL-001", unitCost: 2000, onHand: 50, snapToView: 45, category: "Raw Materials" },
  { id: "2", name: "Tube A", sku: "TUB-001", unitCost: 4000, onHand: 30, snapToView: 28, category: "Components" },
  { id: "3", name: "Copper Wire", sku: "CPR-001", unitCost: 1500, onHand: 120, snapToView: 115, category: "Raw Materials" },
  { id: "4", name: "Bolt M10", sku: "BLT-010", unitCost: 50, onHand: 500, snapToView: 490, category: "Fasteners" },
  { id: "5", name: "Gasket Ring", sku: "GSK-001", unitCost: 300, onHand: 200, snapToView: 195, category: "Seals" },
  { id: "6", name: "Bearing 6205", sku: "BRG-205", unitCost: 850, onHand: 75, snapToView: 70, category: "Components" },
];

export const warehouses: Warehouse[] = [
  { id: "1", name: "Main Warehouse", shortCode: "MW", address: "123 Industrial Ave, Lagos" },
  { id: "2", name: "East Depot", shortCode: "ED", address: "45 Commerce Rd, Ibadan" },
];

export const locations: Location[] = [
  { id: "1", plant: "Plant A", shortCode: "PA", warehouseId: "1", warehouseName: "Main Warehouse" },
  { id: "2", plant: "Plant B", shortCode: "PB", warehouseId: "1", warehouseName: "Main Warehouse" },
  { id: "3", plant: "Plant C", shortCode: "PC", warehouseId: "2", warehouseName: "East Depot" },
];

export const receipts: Receipt[] = [
  { id: "1", reference: "REC/2025/001", date: "2025-01-15", contact: "Acme Supplier", effectiveDate: "2025-01-16", sourceLocation: "Vendor", status: "done", products: [{ productId: "1", productName: "Steel Rod", quantity: 50 }, { productId: "4", productName: "Bolt M10", quantity: 200 }] },
  { id: "2", reference: "REC/2025/002", date: "2025-02-01", contact: "Metro Parts", effectiveDate: "2025-02-02", sourceLocation: "Vendor", status: "validated", products: [{ productId: "2", productName: "Tube A", quantity: 30 }] },
  { id: "3", reference: "REC/2025/003", date: "2025-03-10", contact: "Global Wire Co", effectiveDate: "2025-03-11", sourceLocation: "Vendor", status: "draft", products: [{ productId: "3", productName: "Copper Wire", quantity: 100 }] },
];

export const deliveries: Delivery[] = [
  { id: "1", reference: "DEL/2025/001", date: "2025-01-20", contact: "Client Alpha", effectiveDate: "2025-01-21", destinationAddr: "10 Market St", operationType: "Delivery Orders", status: "done", products: [{ productId: "1", productName: "Steel Rod", quantity: 10 }] },
  { id: "2", reference: "DEL/2025/002", date: "2025-02-15", contact: "Client Beta", effectiveDate: "2025-02-16", destinationAddr: "22 King Rd", operationType: "Delivery Orders", status: "validated", products: [{ productId: "4", productName: "Bolt M10", quantity: 100 }, { productId: "5", productName: "Gasket Ring", quantity: 20 }] },
  { id: "3", reference: "DEL/2025/003", date: "2025-03-05", contact: "Client Gamma", effectiveDate: "2025-03-06", destinationAddr: "5 Central Ave", operationType: "Delivery Orders", status: "draft", products: [{ productId: "6", productName: "Bearing 6205", quantity: 15 }] },
];

export const moveHistory: MoveHistory[] = [
  { id: "1", reference: "MOV/2025/001", date: "2025-01-15", product: "Steel Rod", from: "Vendor", to: "Main Warehouse", quantity: 50, status: "done" },
  { id: "2", reference: "MOV/2025/002", date: "2025-01-20", product: "Steel Rod", from: "Main Warehouse", to: "Client Alpha", quantity: 10, status: "done" },
  { id: "3", reference: "MOV/2025/003", date: "2025-02-01", product: "Tube A", from: "Vendor", to: "Main Warehouse", quantity: 30, status: "done" },
  { id: "4", reference: "MOV/2025/004", date: "2025-02-15", product: "Bolt M10", from: "Main Warehouse", to: "Client Beta", quantity: 100, status: "done" },
  { id: "5", reference: "MOV/2025/005", date: "2025-03-10", product: "Copper Wire", from: "Vendor", to: "Main Warehouse", quantity: 100, status: "pending" },
  { id: "6", reference: "MOV/2025/006", date: "2025-03-05", product: "Bearing 6205", from: "Main Warehouse", to: "Client Gamma", quantity: 15, status: "pending" },
];
