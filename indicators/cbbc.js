/**
 * Generated with ChatGPT from the following TradingView Pine Script:
 * @source https://www.tradingview.com/script/2j6zpcLj-Consecutive-Bullish-Bearish-Candles/
 * @typedef {import('opentrader').ICandlestick} ICandlestick
 */

/**
 * Determines if the last `numConsecutive` candles are all bullish or bearish.
 *
 * @param {ICandlestick[]} candles - Array of candlestick data.
 * @param {number} numConsecutive - Number of consecutive candles to check.
 * @returns {{ bullish: boolean, bearish: boolean }} - Object indicating whether the candles are consecutively bullish or bearish.
 *
 * @example
 * const candles = [
 *   { open: 100, high: 110, low: 95, close: 105, timestamp: 1597026000000 },
 *   { open: 106, high: 112, low: 104, close: 110, timestamp: 1597026060000 },
 *   { open: 111, high: 116, low: 109, close: 115, timestamp: 1597026120000 },
 *   { open: 116, high: 122, low: 114, close: 120, timestamp: 1597026180000 },
 *   { open: 121, high: 126, low: 119, close: 125, timestamp: 1597026240000 },
 * ];
 * consecutiveCandlesIndicator(candles, 5); // { bullish: true, bearish: false }
 */
export function consecutiveCandlesIndicator(candles, numConsecutive) {
  if (candles.length < numConsecutive)
    return { bullish: false, bearish: false };

  const latestCandles = candles.slice(-numConsecutive);
  let bullish = true;
  let bearish = true;

  for (let i = 0; i < latestCandles.length; i++) {
    if (latestCandles[i].close <= latestCandles[i].open) bullish = false;
    if (latestCandles[i].close >= latestCandles[i].open) bearish = false;
  }

  return { bullish, bearish };
}
