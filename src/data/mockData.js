export const reminders = [
  { id: 1, title: 'Restock bottled water', when: 'Today 3:00 PM' },
  { id: 2, title: 'Generator maintenance check', when: 'Tue 10:30 AM' },
  { id: 3, title: 'Update promo display content', when: 'Wed 9:00 AM' },
]

export const devices = [
  { id: 1, name: 'POS-Terminal-01', ip: '192.168.1.21', type: 'POS', status: 'active' },
  { id: 2, name: 'Reception-Tablet', ip: '192.168.1.22', type: 'Tablet', status: 'active' },
  { id: 3, name: 'Office-Laptop-A', ip: '192.168.1.23', type: 'Laptop', status: 'paused' },
  { id: 4, name: 'Smart-TV-Lobby', ip: '192.168.1.24', type: 'Display', status: 'active' },
  { id: 5, name: 'IoT-Camera-01', ip: '192.168.1.25', type: 'Camera', status: 'active' },
  { id: 6, name: 'IoT-Camera-02', ip: '192.168.1.26', type: 'Camera', status: 'active' },
  { id: 7, name: 'Staff-Phone-01', ip: '192.168.1.27', type: 'Mobile', status: 'active' },
  { id: 8, name: 'Staff-Phone-02', ip: '192.168.1.28', type: 'Mobile', status: 'kicked' },
  { id: 9, name: 'Warehouse-PC', ip: '192.168.1.29', type: 'Desktop', status: 'active' },
  { id: 10, name: 'Router-Edge', ip: '192.168.1.1', type: 'Router', status: 'active' },
  { id: 11, name: 'Printer-Backoffice', ip: '192.168.1.30', type: 'Printer', status: 'paused' },
  { id: 12, name: 'MeetingRoom-MiniPC', ip: '192.168.1.31', type: 'Mini PC', status: 'active' },
]

export const files = [
  { id: 1, name: 'shift_roster_march.pdf', type: 'document', size: '1.2 MB', updated: '2h ago' },
  { id: 2, name: 'camera_backup_2026_03_28.zip', type: 'archive', size: '2.8 GB', updated: '1d ago' },
  { id: 3, name: 'inventory_q1.csv', type: 'spreadsheet', size: '620 KB', updated: '3d ago' },
  { id: 4, name: 'promo_banner_v4.psd', type: 'image', size: '95 MB', updated: '5d ago' },
]

export const inventory = [
  {
    id: 1,
    sku: 'INV-001',
    item: 'Router AX6000',
    qty: 12,
    location: 'Rack A1',
    category: 'Networking',
    reorderLevel: 10,
  },
  {
    id: 2,
    sku: 'INV-002',
    item: 'PoE Switch 24-port',
    qty: 8,
    location: 'Rack A2',
    category: 'Networking',
    reorderLevel: 6,
  },
  {
    id: 3,
    sku: 'INV-003',
    item: 'IP Camera Dome',
    qty: 34,
    location: 'Shelf C1',
    category: 'Security',
    reorderLevel: 12,
  },
  {
    id: 4,
    sku: 'INV-004',
    item: 'SSD 1TB',
    qty: 21,
    location: 'Shelf B4',
    category: 'Storage',
    reorderLevel: 8,
  },
  {
    id: 5,
    sku: 'INV-005',
    item: 'Cat6 Cable Box',
    qty: 53,
    location: 'Storage S2',
    category: 'Accessories',
    reorderLevel: 20,
  },
]

export const defaultUsers = [
  { id: 1, name: 'Aisha Malik', role: 'Admin', email: 'aisha@vorlan.local' },
  { id: 2, name: 'Bilal Ahmed', role: 'Employee', email: 'bilal@vorlan.local' },
  { id: 3, name: 'Sana Rehman', role: 'Employee', email: 'sana@vorlan.local' },
  { id: 4, name: 'Guest Account', role: 'Guest', email: 'guest@vorlan.local' },
]
