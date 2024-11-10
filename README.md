# Custom strategy template for [OpenTrader](https://github.com/bludnic/opentrader)

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
