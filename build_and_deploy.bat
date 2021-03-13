cd resources
call node createCoinList.js
cd..
timeout 3
cls
call echo dist klasoru temizleniyor...

if exist "/dist" rmdir "/dist" /q /s

call echo proje build ediliyor...

call npm run build
timeout 3
cls
call echo proje deploy ediliyor...

call node deploy_to_s3.js
call echo ---------------------------
call echo proje deploy edildi...
timeout 3
start "" http://crptocointracker.s3-website.eu-central-1.amazonaws.com/