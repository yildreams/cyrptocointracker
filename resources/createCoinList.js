const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
console.log("liste olusturuluyor");
readXlsxFile('coinlist.xlsx').then((rows) => {
	let list=[];
	console.log("Excell dosyasi okundu.Kayit sayisi:" + rows.length);
  for (var i = rows.length - 1; i >= 1; i--) { 
  	let row=rows[i];
  	var obj={
  		cap:row[0],
  		name:row[1],
  		val:row[2],
  		text:row[3],
  		price:"-",
  		color:"",
  		pic:row[4]?row[4]:"https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"};

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
})