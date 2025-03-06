# Custom strategies by [OpenTrader](https://github.com/bludnic/opentrader)

## Setup

1. Install dependencies

```bash
npm install
```

2. Set admin password

```bash
npx opentrader set-password <password>
```

3. Start the OpenTrader

```bash
npm run start
```

## Custom strategy

To create a custom strategy, add a new `.mjs` file in the [/strategies](/strategies) dir.
The file must export a generator function using `default export`.

For an example, check: [rsiStrategy.mjs](/strategies/rsiStrategy.mjs)

## UI

Once your strategy is ready, start OpenTrader: `npm run start`.

1. Open the UI at http://localhost:8000
2. Select `Create new bot → Custom strategy`
3. In the selection field, pick your strategy, configure the options, then save and run.

## Run with PM2

To run the bot on a VPS and keep it running in the background, you can use PM2.

```bash
npm install -g pm2

pm2 start npm --name "opentrader" -- start

pm2 status
```
