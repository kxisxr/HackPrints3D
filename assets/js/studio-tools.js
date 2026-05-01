document.addEventListener("DOMContentLoaded", () => {
    const peso = document.getElementById("peso");
    const tiempo = document.getElementById("tiempo");
    const material = document.getElementById("material");
    const diametro = document.getElementById("diametro");
    const incluirManoObra = document.getElementById("incluirManoObra");
    const total = document.getElementById("costoTotal");
    const breakdownMaterial = document.getElementById("breakdown-material");
    const breakdownEnergy = document.getElementById("breakdown-energy");
    const breakdownLabor = document.getElementById("breakdown-labor");
    const breakdownMargin = document.getElementById("breakdown-margin");

    const filamentWeight = document.getElementById("filament-weight");
    const filamentDensity = document.getElementById("filament-density");
    const filamentDiameter = document.getElementById("filament-diameter");
    const spoolWeight = document.getElementById("spool-weight");
    const filamentLength = document.getElementById("filament-length");
    const filamentSpoolStatus = document.getElementById("filament-spool-status");

    const currency = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2
    });

    const filamentMetersFromWeight = (weight, density, diameter) => {
        const radiusCm = (diameter / 10) / 2;
        const areaCm2 = Math.PI * radiusCm * radiusCm;
        const volumeCm3 = weight / density;
        const lengthCm = volumeCm3 / areaCm2;
        return lengthCm / 100;
    };

    const calculateCost = () => {
        if (!peso || !tiempo || !material || !diametro || !total) return;

        const pesoGramos = Number(peso.value);
        const tiempoHoras = Number(tiempo.value);
        const costoPorKg = Number(material.value);
        const includeLabor = Boolean(incluirManoObra?.checked);

        if (pesoGramos <= 0 || tiempoHoras <= 0 || costoPorKg <= 0) {
            total.textContent = "Datos invalidos";
            return;
        }

        const costoElectricidadPorKwh = 4.5;
        const consumoImpresoraKw = 0.2;
        const costoManoObraPorHora = 35;
        const multiplicadorGanancia = 1.6;

        const costoMaterial = (pesoGramos / 1000) * costoPorKg;
        const costoEnergia = tiempoHoras * consumoImpresoraKw * costoElectricidadPorKwh;
        const costoLabor = includeLabor ? tiempoHoras * costoManoObraPorHora : 0;
        const costoFinal = (costoMaterial + costoEnergia + costoLabor) * multiplicadorGanancia;

        total.textContent = currency.format(costoFinal);
        breakdownMaterial.textContent = currency.format(costoMaterial);
        breakdownEnergy.textContent = currency.format(costoEnergia);
        breakdownLabor.textContent = currency.format(costoLabor);
        breakdownMargin.textContent = `${multiplicadorGanancia.toFixed(2)}x`;

        if (filamentWeight && filamentDensity && filamentDiameter) {
            filamentWeight.value = String(pesoGramos);
            const selectedOption = material.options[material.selectedIndex];
            const density = selectedOption?.dataset.density || "1.24";
            filamentDensity.value = density;
            filamentDiameter.value = diametro.value;
            calculateFilament();
        }
    };

    const calculateFilament = () => {
        if (!filamentWeight || !filamentDensity || !filamentDiameter || !filamentLength || !filamentSpoolStatus) return;

        const weight = Number(filamentWeight.value);
        const density = Number(filamentDensity.value);
        const diameterValue = Number(filamentDiameter.value);
        const spool = Number(spoolWeight?.value || 0);

        if (weight <= 0 || density <= 0 || diameterValue <= 0) {
            filamentLength.textContent = "0 m";
            filamentSpoolStatus.textContent = "Ingresa valores validos para calcular el filamento.";
            return;
        }

        const meters = filamentMetersFromWeight(weight, density, diameterValue);
        filamentLength.textContent = `${meters.toFixed(1)} m`;

        if (spool > 0) {
            const diff = spool - weight;
            filamentSpoolStatus.textContent = diff >= 0
                ? `Tu spool alcanza. Te sobraran aprox. ${diff.toFixed(0)} g.`
                : `No alcanza. Te faltan aprox. ${Math.abs(diff).toFixed(0)} g para esta impresion.`;
        } else {
            filamentSpoolStatus.textContent = "Agrega el peso restante del spool para validar disponibilidad.";
        }
    };

    document.getElementById("calculate-cost")?.addEventListener("click", calculateCost);
    document.getElementById("calculate-filament")?.addEventListener("click", calculateFilament);

    [peso, tiempo, material, diametro, incluirManoObra].forEach((field) => {
        field?.addEventListener("input", calculateCost);
        field?.addEventListener("change", calculateCost);
    });

    [filamentWeight, filamentDensity, filamentDiameter, spoolWeight].forEach((field) => {
        field?.addEventListener("input", calculateFilament);
        field?.addEventListener("change", calculateFilament);
    });

    calculateCost();
    calculateFilament();
});
