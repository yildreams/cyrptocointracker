cd resources
call node createCoinList.js
cd..
timeout 2

call echo dist klasoru temizleniyor...

if exist "/dist" rmdir "/dist" /q /s

call echo proje build ediliyor...

call npm run build
timeout 5

call echo proje deploy ediliyor...

call node deploy_to_s3.js
call echo ---------------------------
call echo proje deploy edildi...
timeout 5
