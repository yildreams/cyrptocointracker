<template>
  <div id="app">
    <table class="table table-hower table-dark">
      <thead>
        <tr style="fontSize:60px;color:gray" >
          
          <th scope="col" align="left" colspan="2">COIN</th>
          <th scope="col" align="right">% Dif</th>
          <th scope="col" align="right">Price</th>
          <th scope="col" colspan="2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val,index) in list" :key="index" class="fontboyut" :style="'background-color:#'+ (val.pc<0? 'C2AED6':'80CFA9') +'; cursor:pointer;color:'+val.color" @click="selectedAsThis(val)">
          <td align="left" ><img :src="val.pic" :alt="val.cap" width="60" height="60">{{"  " +val.name}}
          </td>
          <td>{{val.cap}}
            <div class="myDiv" v-if="val.price!='-'"><p>{{val.l}} / {{val.h}}</p></div>
          </td>
          <td>{{Number(val.pc).toFixed(2)}}
          </td>
          <td  align="right">
            {{val.price!="-"? val.price:""}}
            <div class="spinner-grow text-warning" v-if="val.price==='-'"></div>
            <div class="myDiv" v-if="val.price!='-'"><p>{{val.val}}</p></div>
          </td>
          <td scope="col" colspan="2">{{"      "}}</td>
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
    <div v-if="showModal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">{{selectedCoin.cap + " : " + selectedCoin.price  + " " + selectedCoin.val}} </h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" @click="showModal = false">&times;</span>
                  </button>
                </div>
                <div class="modal-body">

                  <p>Define Allert Value</p>
                  <form>
                    <div class="form-group">
                      <label for="email">Up To:</label>
                      <input type="text" class="form-control"  id="up" v-model="tmpUP">
                    </div>
                    <div class="form-group">
                      <label for="pwd">Down To:</label>
                      <input type="text" class="form-control" id="pwd" v-model="tmpDOWN">
                    </div>
                    
                  </form>
                </div>
              
                <div class="modal-footer">
                  <button type="button" class="btn btn-success" @click="goToTheSite(selectedCoin.cap)">Go</button>
                  <button type="button" class="btn btn-danger" @click="removeThis()">Remove</button>
                  <button type="button" class="btn btn-primary" @click="saveIT">Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
  </div>
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
      showModal:false,
      tmpUP:0,
      tmpDOWN:0,
      selectedCoin:{},
      connection: null,
      pairlist:[],
      selectedPair:"-1",
      allList:[],
      filterText:'',
      list:[
        {name:"BTC",cap:"Bitcoin",val:"USDT",text:"btcusdt",price:"-",color:"",pic:"https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",pc:0,l:0,h:0,up:55000,down:4000}
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
    setInterval(function(){
      //console.log("tick");
      window.location.reload(1)
    }, 120000);
  },
  methods:{
    goToTheSite(val){
      val=val.toLowerCase();
      val = val.replace(new RegExp(" ", 'g'), "-");
      var url="https://coinmarketcap.com/currencies/"+ val.trim() +"/";

      window.open(url); 

    },
    saveIT(){
      this.selectedCoin.up=this.tmpUP;
      this.selectedCoin.down=this.tmpDOWN;
      this.showModal=false;
      for (var i = this.list.length - 1; i >= 0; i--) {
        var itm=this.list[i];
        if(itm.text==this.selectedCoin.text){
          this.list[i]=this.selectedCoin;
        }
      }
      localStorage.removeItem('list_coins');
      localStorage.setItem('list_coins',JSON.stringify(this.list));

    },
    playSound (sound) {
     if(sound){
      var audio = new Audio(sound);
        audio.play();
     }
        
      
    },
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
    selectedAsThis(val){
      this.showModal=true;
      this.tmpDOWN=val.down,
      this.tmpUP=val.up;
      this.selectedCoin=val;
      /*
      this.list = this.list.filter(el => el.text != val.text);
       localStorage.removeItem('list_coins');
       localStorage.setItem('list_coins',JSON.stringify(this.list));
      this.startWebSocket();*/
    },removeThis(){
      this.showModal = false
      this.list = this.list.filter(el => el.text != this.selectedCoin.text);
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
      txt+="/"+theval.text+"@ticker" //"@trade"
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
          if (theval.price>dat.c) {
            theval.color="red";
          } else if (theval.price<dat.c) {
            theval.color="green";
          }/*else{
            theval.color="white";
          }*/
          theval.price=dat.c
          theval.pc=dat.P;
          theval.l=dat.l;
          theval.h=dat.h;

          if (Number(theval.price)>Number(theval.up) || theval.up==1000000) {
            self.playSound("https://soundbible.com/mp3/Auditorium%20Applause-SoundBible.com-280911206.mp3");
            theval.up=theval.price * 1.1;
            localStorage.removeItem('list_coins');
            localStorage.setItem('list_coins',JSON.stringify(self.list));
          }

          if (Number(theval.price)<Number(theval.down) || theval.down==-1) {
            self.playSound("https://soundbible.com/mp3/Glass%20Breaking-SoundBible.com-1765179538.mp3");
            theval.down=theval.price*0.9;
            localStorage.removeItem('list_coins');
            localStorage.setItem('list_coins',JSON.stringify(self.list));
          }

        }
      }
    }

    this.connection.onopen = function() {
      self.playSound ();
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
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
