(function () {
  const STORAGE_KEY = 'ujinn_currency';
  const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  const CURRENCIES = {
    NGN: { code: 'NGN', symbol: '?', locale: 'en-NG', maxFraction: 0 },
    USD: { code: 'USD', symbol: '$', locale: 'en-US', maxFraction: 2 }
  };

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function getCachedCurrency() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached = safeParse(raw);
    if (!cached || !cached.code || !cached.ts) return null;
    if (Date.now() - cached.ts > TTL_MS) return null;
    return cached;
  }

  function storeCurrency(currency) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        code: currency.code,
        locale: currency.locale,
        symbol: currency.symbol,
        ts: Date.now()
      }));
    } catch (e) {
      // ignore storage errors
    }
  }

  async function detectCurrency() {
    const cached = getCachedCurrency();
    if (cached) return cached;

    let currency = CURRENCIES.USD;
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.country_code === 'NG') {
          currency = CURRENCIES.NGN;
        }
      }
    } catch (e) {
      // fallback to USD
    }

    storeCurrency(currency);
    return currency;
  }

  function formatPrice(amount, currencyCode) {
    const currency = currencyCode === 'NGN' ? CURRENCIES.NGN : CURRENCIES.USD;
    const value = Number(amount) || 0;

    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code,
        currencyDisplay: 'symbol',
        maximumFractionDigits: currency.maxFraction
      }).format(value);
    }

    return currency.symbol + value.toLocaleString(currency.locale);
  }

  function pickPrice(product, currencyCode) {
    if (!product) return { value: 0, code: 'NGN' };
    const ngn = Number(product.price ?? product.priceNGN ?? 0) || 0;
    if (currencyCode === 'NGN') {
      return { value: ngn, code: 'NGN' };
    }
    const usd = Number(product.priceUSD);
    if (!Number.isNaN(usd) && usd > 0) return { value: usd, code: 'USD' };
    // Fallback to NGN if USD is not set
    return { value: ngn, code: 'NGN' };
  }

  function getCurrencySync() {
    const cached = getCachedCurrency();
    if (cached) return cached;
    return CURRENCIES.USD;
  }

  const readyPromise = detectCurrency().then(c => c);

  window.currencyUtils = {
    ready: () => readyPromise,
    getCurrencySync,
    formatPrice,
    pickPrice
  };
})();
