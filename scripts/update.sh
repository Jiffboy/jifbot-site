sudo systemctl stop backend.service

cd ..
git pull

cd frontend
npm install
npm run build

sudo systemctl start backend.service