cd resources
node createCoinList.js
cd..
timeout 2
echo " "
echo "dist klasoru temizleniyor..."
echo " "
if exist "/dist" rmdir "/dist" /q /s
npm run build
timeout 5