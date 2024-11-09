import { z } from "zod";
import { buy, sell, cancelSmartTrade, useRSI } from "opentrader/effects";

/**
 * Buy and Sell based on RSI indicator value.
 * Inspired by https://github.com/askmike/gekko/blob/develop/strategies/RSI.js
 */
export default function* rsi(ctx) {
  const {
    config: { settings: params },
    state,
  } = ctx;

  if (ctx.onStart) {
    console.log(params, "[RSI] Bot started with params");
    return;
  }

  if (ctx.onStop) {
    console.log("[RSI] Bot stopped");
    yield cancelSmartTrade();
    return;
  }

  if (!state.trend) {
    state.trend = {
      direction: "none",
      duration: 0,
      persisted: false,
      adviced: false,
    };

    console.log(state, "[RSI] State initialized");
  }

  const rsi = yield useRSI(params.periods);
  console.log(`[RSI] RSI value: ${rsi}`);

  if (rsi > params.high) {
    // new trend detected
    if (state.trend.direction !== "high") {
      state.trend = {
        duration: 0,
        persisted: false,
        direction: "high",
        adviced: false,
      };
    }

    state.trend.duration++;

    console.log(`[RSI] In high since ${state.trend.duration} candle(s)`);

    if (state.trend.duration >= params.persistence) {
      state.trend.persisted = true;
    }

    if (state.trend.persisted && !state.trend.adviced) {
      state.trend.adviced = true;

      console.log("[RSI] Advised to SELL");
      yield sell({
        quantity: params.quantity,
        orderType: "Market",
      });
    }
  } else if (rsi < params.low) {
    // new trend detected
    if (state.trend.direction !== "low") {
      state.trend = {
        duration: 0,
        persisted: false,
        direction: "low",
        adviced: false,
      };
    }

    state.trend.duration++;

    console.log(`[RSI] In low since ${state.trend.duration} candle(s)`);

    if (state.trend.duration >= params.persistence) {
      state.trend.persisted = true;
    }

    if (state.trend.persisted && !state.trend.adviced) {
      state.trend.adviced = true;

      console.log("[RSI] Advised to BUY");
      yield buy({
        quantity: params.quantity,
        orderType: "Market",
      });
    }
  } else {
    console.log("[RSI] In no trend");
  }
}

rsi.displayName = "RSI Strategy";
rsi.schema = z.object({
  high: z
    .number()
    .min(0)
    .max(100)
    .default(70)
    .describe("Sell when RSI is above this value"),
  low: z
    .number()
    .min(0)
    .max(100)
    .default(30)
    .describe("Buy when RSI is below this value"),
  periods: z.number().positive().default(14).describe("RSI period"),
  persistence: z
    .number()
    .positive()
    .default(1)
    .describe("Number of candles to persist in trend before buying/selling"),
  quantity: z
    .number()
    .positive()
    .default(0.0001)
    .describe("Quantity to buy/sell"),
});

rsi.requiredHistory = 15;
rsi.timeframe = ({ timeframe }) => timeframe;
rsi.runPolicy = {
  onCandleClosed: true,
};
rsi.watchers = {
  watchCandles: ({ symbol }) => symbol,
};
