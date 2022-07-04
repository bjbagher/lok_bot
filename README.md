# LOK_Bot

# Get Started

## Requirements
* npm
* node 
* sqlite3
* git


## Get repo
```bash
git clone https://github.com/bjbagher/lok_bot.git
cd lok_bot
```
  
## Install Deps
```bash
npm install
```

## Create/Sync DB 
```bash
npm run db:push
```

## Modify main
```typescript
const accessToken =  //<your_token>
const from = //<from_land_id>
const to = //<to_land_id>
```
## Run Main
```bash
npm start
```
## Access DB
```bash
sqlite3 prisma/dev.db
select * from land;
```
