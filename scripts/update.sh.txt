sudo systemctl stop backend.service

cd ..
git pull

cd frontend
npm install
npm build

sudo systemctl start backend.service