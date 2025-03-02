import { cancelSmartTrade, useDca } from "opentrader";
import { z } from "zod";
import { consecutiveCandlesIndicator } from "../indicators/cbbc.js";

/**
 * This strategy utilizes the custom "Consecutive-Bullish-Bearish-Candles" (CBBC) indicator:
 * https://www.tradingview.com/script/2j6zpcLj-Consecutive-Bullish-Bearish-Candles
 *
 * How it works:
 * -------------
 * The strategy detects sequences of N consecutive bullish or bearish candles
 * (configured in bot settings) to identify potential market reversals.
 *
 * 1. When a bearish signal is detected, the strategy places a DCA (Dollar-Cost Averaging) trade
 *   with a take profit (TP) percentage specified in the settings.
 * 2. Optionally, it can also place Safety Orders.
 * -------------
 *
 * @author bludnic
 *
 * @typedef {z.infer<typeof cbbc.schema>} StrategyConfig
 * @typedef {import('opentrader').IBotConfiguration<StrategyConfig>} BotConfig
 * @typedef {import('opentrader').TBotContext<BotConfig>} Context
 * @type {(ctx: Context) => any}
 */
export default function* cbbc(ctx) {
  const { config, market, onStart, onStop } = ctx;
  const { settings } = config;

  if (onStop) {
    yield cancelSmartTrade();
    console.info(`[Strategy] Bot with ${config.symbol} pair stopped`);

    return;
  }

  if (onStart) {
    console.info(
      `[Strategy] Bot strategy started on ${config.symbol} pair with params`,
      settings,
    );

    return;
  }

  console.info("[Strategy] Executing strategy");

  console.info(`[Strategy] Latest candles (History: ${market.candles.length})`);
  console.table(
    market.candles
      .slice(-Math.max(5, settings.cbbcConsecutiveCandles))
      .map((candle) => ({
        ...candle,
        bullish: candle.close > candle.open,
        bearish: candle.close < candle.open,
      })),
  );

  const cbbcIndicator = consecutiveCandlesIndicator(
    market.candles,
    settings.cbbcConsecutiveCandles,
  );
  console.info("[Strategy] CBBC Indicator", cbbcIndicator);

  const entryConditionMet = cbbcIndicator.bearish;
  if (entryConditionMet) {
    console.info("[Strategy] Entry condition met. Placing a DCA order");
    yield useDca({
      quantity: settings.quantity,
      tpPercent: settings.tpPercent / 100,
      safetyOrders: [],
    });
    console.log(
      `[Strategy] DCA order placed for ${config.symbol}: Entry: market, Qty: ${settings.quantity}, TP: ${settings.tpPercent}%`,
    );
  }
}

cbbc.displayName = "Consecutive-Bullish-Bearish";
cbbc.description =
  "The strategy detects sequences of N consecutive bearish candles and opens a DCA trade.";

cbbc.schema = z.object({
  quantity: z.number().describe("Entry order quantity"),
  tpPercent: z.number().default(2).describe("Take profit percentage"),
  cbbcConsecutiveCandles: z
    .number()
    .default(3)
    .describe(
      "Number of consecutive candles for Consecutive-Bullish-Bearish-Candles indicator",
    ),
});

/**
 * @type {(config: BotConfig) => number}
 */
cbbc.requiredHistory = (config) => config.settings.cbbcConsecutiveCandles;

cbbc.runPolicy = {
  onCandleClosed: true,
  onOrderFilled: true,
};

cbbc.watchers = {
  watchCandles: ({ symbol }) => symbol,
};
