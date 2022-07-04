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

## Set Land ID range in src/index.js

```typescript
export const FROM = 164148;
export const TO = 164149;
```

## CSV output

```bash
npm run start:csv
```

## DB usage

### Create/Sync DB

```bash
npm run db:push
```

### Run script

```bash
npm run start:db
```

### Access DB

```bash
sqlite3 prisma/dev.db
select * from land;
```
