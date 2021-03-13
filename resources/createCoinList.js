const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
console.log("liste olusturuluyor");
readXlsxFile('coinlist.xlsx').then((rows) => {
	let list=[];
	let indexlist=[];
	console.log("Excell dosyasi okundu.Kayit sayisi:" + rows.length);

	fs.readFile('coinindex.txt', 'utf8', function (err,indexs) {
	  if (err) {
	    console.log("coinindex.txt Detay:" + err);
	  }else{
	  	indexlist=JSON.parse(indexs);
	  	console.log("coinindex.txt dosyasi okundu. kayit sayisi:" + indexlist.length);
	  	for (var i = rows.length - 1; i >= 1; i--) { 
		  	let row=rows[i];
		  	var obj={
		  		cap:row[0],
		  		name:row[1],
		  		val:row[2],
		  		text:row[3],
		  		price:"-",
		  		color:"",
		  		up:1000000,
		  		down:-1,
		  		pic:"https://s2.coinmarketcap.com/static/img/coins/64x64/" + getIndex(indexlist,row[1]) +".png"};

		  	list.push(obj);
		};

		console.log("dinamik js dosyasi oluşturuluyor...");
		fs.readFile('../src/config/SiteValues_draft.js', 'utf8', function (err,data) {
		  if (err) {
		    console.log("SiteValues_draft.js dosyasi okumanadi. Detay:" + err);
		  }else{
		  	data = data.replace(new RegExp("aaa", 'g'), JSON.stringify(list));

			  //console.log(data);
			  fs.writeFile('../src/config/SiteValues.js', data, function (err,data) {
				  if (err) {
				    console.log("SiteValues.js dosyasi degistirilemedi. Detay:" + err);
				  }else{
				  	console.log("SiteValues.js dosyasi basariyla olusturuldu");
				  }
				  
				});
		  }
		});


	  }
	});

  


})

function getIndex(list , val){
	for (var i = list.length - 1; i >= 0; i--) {
		var itm=list[i];
		if (itm.symbol==val) {
			return itm.id;
		};
	};
	return 1;
}