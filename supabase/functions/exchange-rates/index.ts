import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch BTC price and fiat rates in parallel
    const [btcRes, fiatRes] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,ngn,eur,gbp'),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=ngn,eur,gbp'),
    ]);

    const btcData = await btcRes.json();
    const fiatData = await fiatRes.json();

    // Build rates object with USD as base
    const btcPrices = btcData.bitcoin || {};
    
    // Use exchangerate-api as fallback for fiat rates since coingecko fiat can be spotty
    let fiatRates = { ngn: 1550, eur: 0.92, gbp: 0.79 };
    
    try {
      const fiatFallback = await fetch('https://open.er-api.com/v6/latest/USD');
      const fiatFallbackData = await fiatFallback.json();
      if (fiatFallbackData.rates) {
        fiatRates = {
          ngn: fiatFallbackData.rates.NGN || fiatRates.ngn,
          eur: fiatFallbackData.rates.EUR || fiatRates.eur,
          gbp: fiatFallbackData.rates.GBP || fiatRates.gbp,
        };
      }
    } catch {
      // Use defaults
    }

    const rates = {
      "USD-NGN": fiatRates.ngn,
      "USD-EUR": fiatRates.eur,
      "USD-GBP": fiatRates.gbp,
      "BTC-USD": btcPrices.usd || 67500,
      "BTC-NGN": btcPrices.ngn || (btcPrices.usd || 67500) * fiatRates.ngn,
      "BTC-EUR": btcPrices.eur || (btcPrices.usd || 67500) * fiatRates.eur,
      "BTC-GBP": btcPrices.gbp || (btcPrices.usd || 67500) * fiatRates.gbp,
      timestamp: Date.now(),
    };

    return new Response(JSON.stringify(rates), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
