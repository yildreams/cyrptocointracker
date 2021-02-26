<template>
  <div id="app">
    <table class="table table-hower table-dark">
      <thead>
        <tr style="fontSize:60px;color:gray" >
          
          <th scope="col" align="left" colspan="2">COIN</th>
          <th scope="col" align="right">Price</th>
          <th scope="col" colspan="2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val,index) in list" :key="index" class="fontboyut" :style="'cursor:pointer;color:'+val.color" @click="removeThis(val)">
          <td align="left" ><img :src="val.pic" :alt="val.cap" width="60" height="60">{{"  " +val.name}}</td>
          <td>{{val.cap}}</td>
          <td  align="right">{{val.price!="-"? val.price:""}}<div class="spinner-grow text-warning" v-if="val.price==='-'"></div><div class="myDiv" v-if="val.price!='-'">
  <p>{{val.val}}</p>
</div></td>
          <th scope="col" colspan="2">{{"      "}}</th>
        </tr>
      </tbody>
    </table>
    <br/>
    <h1>Şunları da ekleyebilirsin</h1>
    
    <table class="table table-striped table-dark">
      <thead>
        <tr style="fontSize:20px;color:gray;">
          <th scope="col" align="left" style="width: 3%"></th>
          <th scope="col" align="left" style="width: 15%">Coin</th>
          <th scope="col" style="width: 42%" align="left">Name</th>
          <th scope="col" style="width: 20%" align="left">Pair</th>
          <th scope="col" style="width: 20%" align="right">Key</th>
        </tr>
      </thead>
      <thead>
        <tr style="fontSize:20px;color:gray">
          <th scope="col" colspan="3" align="left">
<div style="float: right;width:100%"><input placeholder="Search Coin" type="text" id="filterText" name="filterText" v-model="filterText" style="width:100%;height:35px; text-align:left;font-size:15px;"/></div> </th>
         
          <th scope="col" align="left">
          <select v-model="selectedPair" class="browser-default custom-select">
  <option selected value="-1">Select Pair</option>
  <option :value="i" v-for="(i,index) in pairlist" :key="index">{{i}}</option>
</select></th>
          <th scope="col" align="right"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val,index) in allList" :key="index" @click="selectThis(val)" style="cursor:pointer;" v-show="checkVisibility(val)">
          <td align="left" ><img :src="val.pic" :alt="val.cap" width="25" height="25"></td>
          <td align="left" >{{"  " +val.name}}</td>
          <td>{{val.cap}}</td>
          <td>{{val.val}}</td>
          <td>{{val.text}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import SiteValues from './config/SiteValues'

export default {
  name: 'App',
  components: {
    //HelloWorld
  },data: function() {
    return {
      connection: null,
      pairlist:[],
      selectedPair:"-1",
      allList:[],
      filterText:'',
      list:[
        {name:"BTC",cap:"Bitcoin",val:"USDT",text:"btcusdt",price:"-",color:"",pic:"https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"}
        ]
    }
  },
  created: function() {
    this.allList=SiteValues.getList();
    for (var i = this.allList.length - 1; i >= 0; i--) {
      let a=this.allList[i];
      if (this.pairlist.indexOf(a.val)<0) {
        this.pairlist.push(a.val);
      }
    }
    this.pairlist.sort();
    var samplelist_data =JSON.parse(localStorage.getItem("list_coins"));
    if (samplelist_data) {
      this.list=samplelist_data;
    }
    this.startWebSocket();
  },
  methods:{
    checkVisibility(val){
      for (var i = this.list.length - 1; i >= 0; i--) {
        var itm=this.list[i];
        if (itm.text===val.text) return false;
      }
      return ((this.filterText.length==0 || val.name.toLowerCase().indexOf(this.filterText.toLowerCase())>=0 || val.cap.toLowerCase().indexOf(this.filterText.toLowerCase())>=0) && (this.selectedPair=="-1" || val.val==this.selectedPair))
    },
    selectThis(val){
      this.list.push(val);
     
       localStorage.removeItem('list_coins');
       localStorage.setItem('list_coins',JSON.stringify(this.list));
      this.startWebSocket();
    },
    removeThis(val){
      this.list = this.list.filter(el => el.text != val.text);
       localStorage.removeItem('list_coins');
       localStorage.setItem('list_coins',JSON.stringify(this.list));
      this.startWebSocket();
    },
    startWebSocket(){
      //console.log(this.allList);
    //console.log("Starting connection to WebSocket Server")
    var txt="";
    for (var i = this.list.length - 1; i >= 0; i--) {
      let theval=this.list[i];
      txt+="/"+theval.text+"@trade"
    }
    this.connection = new WebSocket("wss://stream.binance.com:9443/ws" + txt)
    var self = this;
    this.connection.onmessage = function(event) {
      var dat=JSON.parse(event.data)
      //console.log(dat);
      for (var i = self.list.length - 1; i >= 0; i--) {
        let theval=self.list[i];
        let compText=theval.name+theval.val
        if (dat.s==compText) {
          if (theval.price>dat.p) {
            theval.color="red";
          } else if (theval.price<dat.p) {
            theval.color="green";
          }else{
            theval.color="white";
          }
          theval.price=dat.p

        }
      }
    }

    this.connection.onopen = function() {
      //console.log(event)
      //console.log("Successfully connected to the echo websocket server...")
    }

    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

@media only screen and (max-width: 959px) {
.fontboyut{
  font-size: 20px;
}
.myDiv{
  font-size: 8px;
}

}

@media only screen and (min-width: 960px) { 
.fontboyut{
  font-size: 50px;
}
.myDiv{
  font-size: 12px;
  padding-top: 0px;
  margin-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

}

</style>
