// Ice Cream Sales Assessment – Node.js (No external libraries)

const data = `Date,SKU,Unit Price,Quantity,Total Price
2019-01-01,Death by Chocolate,180,5,900
2019-01-01,Cake Fudge,150,1,150
2019-01-01,Cake Fudge,150,1,150
2019-01-01,Cake Fudge,150,3,450
2019-01-01,Death by Chocolate,180,1,180
2019-01-01,Vanilla Double Scoop,80,3,240
2019-01-01,Butterscotch Single Scoop,60,5,300
2019-01-01,Vanilla Single Scoop,50,5,250
2019-01-01,Cake Fudge,150,5,750
2019-01-01,Hot Chocolate Fudge,120,3,360
2019-01-01,Butterscotch Single Scoop,60,5,300
2019-01-01,Chocolate Europa Double Scoop,100,1,100
2019-01-01,Hot Chocolate Fudge,120,2,240
2019-01-01,Caramel Crunch Single Scoop,70,4,280
2019-01-01,Hot Chocolate Fudge,120,2,240
2019-01-01,Hot Chocolate Fudge,120,4,480
2019-01-01,Hot Chocolate Fudge,120,2,240
2019-01-01,Cafe Caramel,160,5,800
2019-01-01,Vanilla Double Scoop,80,4,320
2019-01-01,Butterscotch Single Scoop,60,3,180
2019-02-01,Butterscotch Single Scoop,60,3,180
2019-02-01,Vanilla Single Scoop,50,2,100
2019-02-01,Butterscotch Single Scoop,60,3,180
2019-02-01,Vanilla Double Scoop,80,1,80
2019-02-01,Death by Chocolate,180,2,360
2019-02-01,Cafe Caramel,160,2,320
2019-02-01,Pista Single Scoop,60,3,180
2019-02-01,Hot Chocolate Fudge,120,2,240
2019-02-01,Vanilla Single Scoop,50,3,150
2019-02-01,Vanilla Single Scoop,50,5,250
2019-02-01,Cake Fudge,150,1,150
2019-02-01,Vanilla Single Scoop,50,4,200
2019-02-01,Vanilla Double Scoop,80,3,240
2019-02-01,Cake Fudge,150,1,150
2019-02-01,Vanilla Double Scoop,80,5,400
2019-02-01,Hot Chocolate Fudge,120,5,600
2019-02-01,Vanilla Double Scoop,80,2,160
2019-02-01,Vanilla Double Scoop,80,3,240
2019-02-01,Hot Chocolate Fudge,120,5,600
2019-02-01,Cake Fudge,150,5,750
2019-03-01,Vanilla Single Scoop,50,5,250
2019-03-01,Cake Fudge,150,5,750
2019-03-01,Pista Single Scoop,60,1,60
2019-03-01,Butterscotch Single Scoop,60,2,120
2019-03-01,Vanilla Double Scoop,80,1,80
2019-03-01,Cafe Caramel,160,1,160
2019-03-01,Cake Fudge,150,5,750
2019-03-01,Trilogy,160,5,800
2019-03-01,Butterscotch Single Scoop,60,3,180
2019-03-01,Death by Chocolate,180,2,360
2019-03-01,Butterscotch Single Scoop,60,1,60
2019-03-01,Hot Chocolate Fudge,120,3,360
2019-03-01,Cake Fudge,150,2,300
2019-03-01,Cake Fudge,150,2,300
2019-03-01,Vanilla Single Scoop,50,4,100
2019-03-01,Cafe Caramel,160,0,160
2019-03-01,Cake Fudge,150,5,750
2019-03-01,Cafe Caramel,160,5,800
2019-03-01,Almond Fudge,150,1,150
2019-03-01,Cake Fudge,150,1,150`;

const rows = data.trim().split("\n");
rows.shift();

console.log("rows", rows);

let totalSales = 0;
const monthlySales = {};
const quantityByMonthItem = {};
const revenueByMonthItem = {};
const inconsistencies = [];

rows.forEach((row, index) => {
  const [date, sku, unitPriceStr, qtyStr, totalStr] = row.split(",");
  const unitPrice = Number(unitPriceStr);
  const quantity = Number(qtyStr);
  const totalPrice = Number(totalStr);
  const month = date?.slice(0, 7);

  if (unitPrice * quantity !== totalPrice)
    inconsistencies.push({ row: index + 2, error: "Price mismatch" });
  if (quantity < 1)
    inconsistencies.push({ row: index + 2, error: "Invalid quantity" });
  if (unitPrice < 0)
    inconsistencies.push({ row: index + 2, error: "Invalid unit price" });
  if (totalPrice < 0)
    inconsistencies.push({ row: index + 2, error: "Invalid total price" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    inconsistencies.push({ row: index + 2, error: "Malformed date" });

  totalSales += totalPrice;

  monthlySales[month] = (monthlySales[month] || 0) + totalPrice;

  quantityByMonthItem[month] = quantityByMonthItem[month] || {};
  quantityByMonthItem[month][sku] =
    (quantityByMonthItem[month][sku] || 0) + quantity;

  revenueByMonthItem[month] = revenueByMonthItem[month] || {};
  revenueByMonthItem[month][sku] =
    (revenueByMonthItem[month][sku] || 0) + totalPrice;
});

const popularStats = {};
Object.keys(quantityByMonthItem).forEach((month) => {
  const items = quantityByMonthItem[month];
  let maxItem = null;
  let maxQty = 0;
  let quantities = [];

  for (const item in items) {
    quantities.push(items[item]);
    if (items[item] > maxQty) {
      maxQty = items[item];
      maxItem = item;
    }
  }

  popularStats[month] = {
    item: maxItem,
    min: Math.min(...quantities),
    max: Math.max(...quantities),
    avg: quantities.reduce((a, b) => a + b, 0) / quantities.length,
  };
});

const topRevenueItems = {};
Object.keys(revenueByMonthItem).forEach((month) => {
  let maxItem = null;
  let maxRevenue = 0;
  for (const item in revenueByMonthItem[month]) {
    if (revenueByMonthItem[month][item] > maxRevenue) {
      maxRevenue = revenueByMonthItem[month][item];
      maxItem = item;
    }
  }
  topRevenueItems[month] = { item: maxItem, revenue: maxRevenue };
});

const growth = {};
const months = Object.keys(quantityByMonthItem).sort();

for (let i = 1; i < months.length; i++) {
  const prev = months[i - 1];
  const curr = months[i];
  growth[curr] = {};

  const items = new Set([
    ...Object.keys(quantityByMonthItem[prev]),
    ...Object.keys(quantityByMonthItem[curr]),
  ]);

  items.forEach((item) => {
    const prevQty = quantityByMonthItem[prev][item] || 0;
    const currQty = quantityByMonthItem[curr][item] || 0;
    if (prevQty > 0) {
      growth[curr][item] = ((currQty - prevQty) / prevQty) * 100;
    }
  });
}

console.log("Total Sales:", totalSales);
console.log("Monthly Sales:", monthlySales);
console.log("Most Popular Items:", popularStats);
console.log("Top Revenue Items:", topRevenueItems);
console.log("Month-to-Month Growth (%):", growth);
console.log("Data Inconsistencies:", inconsistencies);

