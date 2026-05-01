document.addEventListener("DOMContentLoaded", () => {
    const quantityField = document.getElementById("keychain-quantity");
    const sizeField = document.getElementById("keychain-size");
    const styleField = document.getElementById("keychain-style");
    const totalField = document.getElementById("keychain-total");
    const unitField = document.getElementById("keychain-unit");
    const discountField = document.getElementById("keychain-discount");
    const turnaroundField = document.getElementById("keychain-turnaround");
    const marketSummaryField = document.getElementById("keychain-market-summary");

    const currency = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2
    });

    const basePrices = {
        5: 62,
        8: 82,
        10: 99
    };

    const getDiscountMultiplier = (quantity) => {
        if (quantity >= 50) return 0.32;
        if (quantity >= 30) return 0.38;
        if (quantity >= 10) return 0.48;
        if (quantity >= 5) return 0.72;
        return 1;
    };

    const getTurnaround = (quantity) => {
        if (quantity >= 50) return "4 a 7 dias";
        if (quantity >= 20) return "3 a 5 dias";
        return "2 a 4 dias";
    };

    const calculateKeychains = () => {
        if (!quantityField || !sizeField || !styleField || !totalField) return;

        const quantity = Number(quantityField.value);
        const size = Number(sizeField.value);
        const styleMultiplier = Number(styleField.value);

        if (quantity <= 0 || !basePrices[size] || styleMultiplier <= 0) {
            totalField.textContent = "Datos invalidos";
            return;
        }

        const discountMultiplier = getDiscountMultiplier(quantity);
        const unitPrice = basePrices[size] * styleMultiplier * discountMultiplier;
        const totalPrice = unitPrice * quantity;
        const discountPercent = Math.round((1 - discountMultiplier) * 100);

        totalField.textContent = currency.format(totalPrice);
        unitField.textContent = currency.format(unitPrice);
        discountField.textContent = `${discountPercent}%`;
        turnaroundField.textContent = getTurnaround(quantity);

        const sizeLabel = `${size} cm`;
        marketSummaryField.textContent = `Para ${quantity} llaveros de ${sizeLabel}, la referencia cae cerca de ${currency.format(totalPrice)} antes de ajustes por color especial, doble cara, empaque o urgencia.`;
    };

    document.getElementById("calculate-keychain")?.addEventListener("click", calculateKeychains);
    [quantityField, sizeField, styleField].forEach((field) => {
        field?.addEventListener("input", calculateKeychains);
        field?.addEventListener("change", calculateKeychains);
    });

    calculateKeychains();
});
