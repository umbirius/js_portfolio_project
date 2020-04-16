
// Load DOM
document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  grabStocks();
  createTableHeader(stockTable)
  reset.addEventListener("click", () => {
    resetFilter()
    renderByFilter(stocks)
  })

  for (let option of filterOptions) {
    option.addEventListener("change", () => {
      renderByFilter(Stock.filterStocks(filterParams()))
    })
  }
  
  

});



let stocks = []
let div = document.getElementById('tickers');
let stockTable = document.getElementById("tickers");
let filter = document.getElementById("filter")
const reset = document.getElementById("reset")
const filterOptions = document.getElementsByClassName("filter-option")

// create table header
function createTableHeader(table){
  let headers =["Ticker", "Sector", "Market Cap", "Price", "Volume", "Average Volume" ]
  let thead = table.createTHead();
  let row = thead.insertRow();
  let th = document.createElement("th");
  row.appendChild(th);
  th.appendChild(document.createTextNode("Result"))
  for (let header of headers) {
    let th = document.createElement("th");
    th.setAttribute("id", header.replace(/\s/g, ''))
    let text = document.createTextNode(header);
    th.appendChild(text);
    row.appendChild(th);
  }
}

// initalpopulate table from Stocks
function createTableRows(table, stocks){
  let tbody = document.createElement('tbody');
  // let tfooter = table.createTFoot()
  table.appendChild(tbody);

  for (let i = 0; i < stocks.length; i++){
    let stock = (({symbol, sector, market_cap, last_price, vol, avg_vol}) => 
      ({symbol, sector, market_cap, last_price, vol, avg_vol}))(stocks[i])
    let row = tbody.insertRow();
    let cell = row.insertCell();
    let text = document.createTextNode(i+1);
    cell.appendChild(text);
    for (key in stock){
      let cell = row.insertCell();
      let text = document.createTextNode(stock[key]);
      cell.appendChild(text);
    }
  }
}

function renderTableRows(table, stocks){
  let tbody = document.createElement('tbody');
  // let tfooter = table.createTFoot()
  table.appendChild(tbody);

  for (let i = 0; i < stocks.length; i++){
    let stock = (({symbol, sector, market_cap, last_price, vol, avg_vol}) => 
      ({symbol, sector, market_cap, last_price, vol, avg_vol}))(stocks[i])
    let row = tbody.insertRow();
    let cell = row.insertCell();
    let text = document.createTextNode(i+1);
    cell.appendChild(text);
    for (key in stock){
      let cell = row.insertCell();
      let text = document.createTextNode(stock[key]);
      cell.appendChild(text);
    }
  }

}


// Render by active Filter

function renderByFilter(stocks){

  let oldTbody = document.querySelector("#tickers > tbody")
  let newTbody = document.createElement("tbody")
  oldTbody.parentNode.replaceChild(newTbody, oldTbody)

  for (let i = 0; i < stocks.length; i++){
    let stock = (({symbol, sector, market_cap, last_price, vol, avg_vol}) => 
      ({symbol, sector, market_cap, last_price, vol, avg_vol}))(stocks[i])
    let row = newTbody.insertRow();
    let cell = row.insertCell();
    let text = document.createTextNode(i+1);
    cell.appendChild(text);
    for (key in stock){
      let cell = row.insertCell();
      let text = document.createTextNode(stock[key]);
      cell.appendChild(text);
    }
  }
}

function grabStocks(){
  fetch('http://localhost:3000/stocks')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for(let i = 0; i < data.data.length; i++){
        let args = []
        for (key in data.data[i].attributes){
          args.push(data.data[i].attributes[key])
        }
        stocks.push(new Stock(...args))
      }
    })
    .then(() => {
      createTableRows(stockTable, Stock.allStocks.sort(alphaSymbol))
    });
}




class Stock {
  constructor(symbol, market_cap, sector, last_price, fiftytwo_high, fiftytwo_low, 
    vol, avg_vol, rel_vol, insider_own, inst_own){
      this.symbol = symbol;
      this.market_cap = market_cap;
      this.sector = sector;
      this.last_price = last_price;
      this.fiftytwo_high = fiftytwo_high;
      this.fiftytwo_low = fiftytwo_low;
      this.vol = vol;
      this.avg_vol = avg_vol;
      this.rel_vol = rel_vol;
      this.insider_own = insider_own;
      this.inst_own = inst_own;
    }

    static get allStocks(){
      return stocks
    }

    static filterStocks(filterParams) {
      let filter = new Filter(...filterParams)
      let filteredStocks = stocks
      switch (filter.price) {
        case "any":
          break;

        case "sub1":
          filteredStocks = filteredStocks.filter( stock => stock.last_price < 1)
          break;

        case "sub2":
          filteredStocks = filteredStocks.filter( stock => stock.last_price < 5)
          break;  

        case "sub10":
          filteredStocks = filteredStocks.filter( stock => stock.last_price < 10)
          break;

        case "sub20":
          filteredStocks = filteredStocks.filter( stock => stock.last_price < 20)
          break;

        case "sub50":
          filteredStocks = filteredStocks.filter( stock => stock.last_price < 50)
          break;
      }

      switch (filter.volume) {
        case "any":
          break;
      }
  
      switch (filter.avgVolume) {
        case "any":
          break;
      }

      switch (filter.relVolume){
        case "any":
          break;
      }

      switch (filter.sector){
        case "any":
          break;

        case "basic-materials":
          filteredStocks = filteredStocks.filter( stock => stock.sector === "Basic Materials")
          break;
      }

      switch (filter.marketCap){
        case "any":
          break;
          
      }
      
      switch (filter.fiftytwoWeekHigh){
        case "any":
          break;
      }

      switch (filter.fiftytwoWeekLow){
        case "any":
          break;
      }

      switch (filter.insiderOwn){
        case "any":
          break;
      }

      switch (filter.instOwn){
        case "any":
          break;
      }

      return filteredStocks
    }

}

// sorts stock ticker by symbol
function alphaSymbol(a, b) {

  const symbolA = a.symbol;
  const symbolB = b.symbol;

  let comparison = 0;
  if (symbolA > symbolB) {
    comparison = 1;
  } else if (symbolA < symbolB) {
    comparison = -1;
  }
  return comparison;
}

// logs active filter values to pass as argument from Filter class
let filterParams = () => {
  let searchIds = ['price', 'volume', 'avg-volume', 'rel-volume', 'sector',
    'market-cap', '52-week-high', '52-week-low', 'insider-own', 'inst-own']
  let params = [];
  for (let id of searchIds) {
    params.push(document.getElementById(id).selectedOptions[0].value)
    // console.log(id)
  }
  return params
}

// Filter Class
class Filter {
  constructor(price, volume, avgVolume, relVolume, sector, marketCap, 
    fiftytwoWeekHigh, fiftytwoWeekLow, insiderOwn, instOwn) {
      this.price = price;
      this.volume = volume;
      this.avgVolume = avgVolume;
      this.relVolume = relVolume;
      this.sector = sector;
      this.marketCap = marketCap;
      this.fiftytwoWeekHigh = fiftytwoWeekHigh;
      this.fiftytwoWeekLow = fiftytwoWeekLow;
      this.insiderOwn = insiderOwn;
      this.instOwn = instOwn
    }
}

// Reset Filter 

function resetFilter() {
  let searchIds = ['price', 'volume', 'avg-volume', 'rel-volume', 'sector',
  'market-cap', '52-week-high', '52-week-low', 'insider-own', 'inst-own']
  for (let id of searchIds) {
    document.getElementById(id).value = "any"
  }
}



