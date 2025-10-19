function calcularCosto() {
    // 1. Obtener valores del formulario
    const pesoGramos = parseFloat(document.getElementById('peso').value);
    const tiempoHoras = parseFloat(document.getElementById('tiempo').value);
    const costoPorKg = parseFloat(document.getElementById('material').value);
    const incluirManoObra = document.getElementById('incluirManoObra').checked;

    // Validar entradas básicas
    if (isNaN(pesoGramos) || isNaN(tiempoHoras) || pesoGramos <= 0 || tiempoHoras <= 0) {
        document.getElementById('costoTotal').textContent = 'Datos inválidos.';
        return;
    }

    // --- Parámetros de Costo Fijos (AJUSTADOS) ---
    
    // A. Costo de la Electricidad (Nuevo León, CFE Tarifa de Referencia)
    const costoElectricidadPorKWH = 4.50; // MXN por kWh (Ajuste para NL)
    
    // B. Consumo Promedio de la Impresora 3D (Centauri Carbon - Estimado en impresión)
    const consumoImpresoraKW = 0.20; // 200 Watts / 1000 = 0.20 kW (Ajuste para Centauri Carbon)

    // C. Costo por Mantenimiento, Depreciación y Mano de Obra por hora
    const costoManoDeObraPorHora = 30.00; // MXN por hora

    // D. Multiplicador de Ganancia y Riesgo (Margen de Beneficio)
    const multiplicadorGanancia = 1.6;

    // --- CÁLCULOS --- testcomment
    
    // 1. Costo del Material (MXN)
    const pesoKg = pesoGramos / 1000;
    const costoMaterial = pesoKg * costoPorKg; // Usa los nuevos precios del HTML

    // 2. Costo de Energía (MXN)
    const costoEnergia = tiempoHoras * consumoImpresoraKW * costoElectricidadPorKWH;

    // 3. Costo Fijo (Mano de Obra y Desgaste) (MXN)
    let costoManoDeObraTotal = 0;
    
    // Lógica Condicional: Aplicar costo de Mano de Obra si está marcada
    if (incluirManoObra) {
        costoManoDeObraTotal = tiempoHoras * costoManoDeObraPorHora;
    }
    
    // 4. Costo Base Total (Material + Energía + Mano de Obra)
    const costoBase = costoMaterial + costoEnergia + costoManoDeObraTotal;

    // 5. Costo Final (Aplicando Ganancia/Margen)
    const costoFinal = costoBase * multiplicadorGanancia;
    
    // --- MOSTRAR RESULTADO ---
    
    const costoRedondeado = costoFinal.toFixed(2); // Redondear a 2 decimales
    document.getElementById('costoTotal').textContent = `$${costoRedondeado} MXN`;

    // *Desglose en Consola*
    console.log(`--- Desglose de Costos (MXN) ---`);
    console.log(`Costo Material: $${costoMaterial.toFixed(2)}`);
    console.log(`Costo Energía (NL/Centauri Carbon): $${costoEnergia.toFixed(2)}`);
    console.log(`Costo Fijo/M.O.B: $${costoManoDeObraTotal.toFixed(2)} (${incluirManoObra ? 'INCLUIDA' : 'NO INCLUIDA'})`);
    console.log(`Costo Base (sin margen): $${costoBase.toFixed(2)}`);
    console.log(`Costo FINAL (con margen): $${costoRedondeado}`);
}

// Inicializar el cálculo al cargar la página
document.addEventListener('DOMContentLoaded', calcularCosto);
