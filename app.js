const app = new Vue({
  el: "#app",
  data: {
    coins: [],
    specificCoin: {},
    refresh: ""
  },
  methods: {
    growthColor: function(change) {
      if (change < 0) {
        return;
      }
    },
    getCoins: function() {
      fetch("http://coincap.io/front")
        .then(response => response.json())
        .then(data => {
          data.sort(function(a, b) {
            if (a.price == b.price) return 0;
            if (a.price > b.price) return -1;
            if (a.price < b.price) return 1;
          });
          let top8 = data.slice(0, 8);
          this.coins = top8;
        });
    },
    fetchSingleCoin: function(event) {
      if (event.target.value === "") return;
      coinSymbol = event.target.value.toUpperCase();
      fetch("http://coincap.io/page/" + coinSymbol)
        .then(response => response.json())
        .then(data => {
          this.specificCoin = data;
          console.log(this.specificCoin);
        });
    }
  },
  created: function() {
    this.getCoins();
    this.refresh = setInterval(
      function() {
        this.getCoins();
      }.bind(this),
      5000
    );
  },
  destroyed: function() {
    //clear interval if component is destroyed
    clearInterval(this.refresh);
  },
  template: `
  <div class="container has-text-centered">
    <h1 class="title big-title">Top Cryptocurrency By Price</h1>
    <div class="card bitcoin-card">
      <div class="card-content has-text-centered" >
        <p class="title">Search</p>
          <input class="input" type="text" v-on:keydown.enter="fetchSingleCoin($event)" placeholder="Example: BTC">
          <button class="button is-primary" v-on:click="fetchSingleCoin($event)">See price</button>
          <div>
            <p class="subtitle" v-if="specificCoin.id">{{specificCoin.id}}: $\{{specificCoin.price}}</p>
          </div>
        </div>
      </div>
    <div class="card bitcoin-card" v-for="coin in coins">
      <div class="card-content">
        <p class="title">{{coin.long}} ({{coin.short}})</p>
        <p class="subtitle">$\{{coin.price}}</p>
      </div>
      <p class="subtitle">24 hour change:
        <span v-if="coin.cap24hrChange >= 0" class="growth-plus">{{coin.cap24hrChange}}</span>
        <span v-else class="growth-minus">{{coin.cap24hrChange}}</span>
      </p>
    </div>
  </div>
`
});
