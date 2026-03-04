export type DrinkSizeOption = {
  label: string;
  price: number;
};

export type MenuItem = {
  id: number;
  name: string;
  price?: number;
  sizeOptions?: DrinkSizeOption[];
};

export type MenuCategory = {
  id: number;
  name: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: 1,
    name: "Khana Sets",
    items: [
      { id: 1, name: "Thakali Special Set", price: 650 },
      { id: 2, name: "Chicken Set", price: 425 },
      { id: 3, name: "Veg Set", price: 260 },
      { id: 4, name: "Mutton Set", price: 450 },
      { id: 5, name: "Fish Set", price: 450 },
      { id: 6, name: "Paneer Set", price: 370 },
      { id: 7, name: "Egg Set", price: 340 },
      { id: 8, name: "Mushroom Set", price: 350 },
      { id: 9, name: "Mutton Sukuti Gravy Set", price: 500 },
      { id: 10, name: "Veg Baby Set", price: 190 },
      { id: 11, name: "Chicken Baby Set", price: 330 },
      { id: 12, name: "Mutton Baby Set", price: 350 },
      { id: 13, name: "Fish Baby Set", price: 350 },
      { id: 14, name: "Paneer Baby Set", price: 290 },
      { id: 15, name: "Dhindo Extra", price: 30 },
      { id: 16, name: "Plain Dhindo", price: 120 },
    ],
  },

  {
    id: 2,
    name: "Soft Drinks",
    items: [
      { id: 200, name: "Coke", price: 60 },
      { id: 201, name: "Fanta", price: 60 },
      { id: 202, name: "Sprite", price: 60 },
      { id: 203, name: "Fresh Lemon Soda", price: 80 },
      { id: 204, name: "Mohi", price: 30 },
      { id: 205, name: "Plain Curd", price: 60 },
    ],
  },

  {
    id: 3,
    name: "Hard Drinks",
    items: [
      {
        id: 300,
        name: "8848 Vodka",
        sizeOptions: [
          { label: "30ml", price: 130 },
          { label: "60ml", price: 255 },
          { label: "90ml", price: 380 },
          { label: "120ml", price: 500 },
          { label: "Quarter", price: 730 },
          { label: "Half", price: 1500 },
          { label: "Full", price: 2940 },
        ],
      },
      {
        id: 301,
        name: "Ruslan Vodka",
        sizeOptions: [
          { label: "30ml", price: 130 },
          { label: "60ml", price: 255 },
          { label: "90ml", price: 380 },
          { label: "120ml", price: 500 },
          { label: "Quarter", price: 730 },
          { label: "Half", price: 1500 },
          { label: "Full", price: 2940 },
        ],
      },
      {
        id: 302,
        name: "Khukuri Rum",
        sizeOptions: [
          { label: "30ml", price: 125 },
          { label: "60ml", price: 250 },
          { label: "90ml", price: 370 },
          { label: "120ml", price: 485 },
          { label: "Quarter", price: 715 },
          { label: "Half", price: 1460 },
          { label: "Full", price: 2870 },
        ],
      },
      { id: 310, name: "Tuborg", price: 565 },
      { id: 311, name: "Carlsberg", price: 625 },
      { id: 312, name: "Gorkha Strong", price: 450 },
    ],
  },
];
