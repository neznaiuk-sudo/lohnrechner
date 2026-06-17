<template>
  <div class="calculator">
    <div class="header">
      <h1>Lohnsteuer Rechner 2026</h1>
      <p>Berechnung von Lohnsteuer, Solidaritätszuschlag und Kirchenlohnsteuer</p>
    </div>

    <div class="calculator-container">
      <!-- Input Section -->
      <div class="input-section">
        <h2>Eingabeparameter</h2>
        
        <div class="input-group">
          <label>Jahresbruttogehalt (EUR)</label>
          <input v-model.number="inputs.jahresbruttogehalt" type="number" placeholder="z.B. 50000">
        </div>

        <div class="input-group">
          <label>Steuerklasse</label>
          <select v-model.number="inputs.steuerklasse">
            <option value="1">I - Ledige</option>
            <option value="2">II - Alleinerziehende</option>
            <option value="3">III - Verheiratete (höheres Einkommen)</option>
            <option value="4">IV - Verheiratete (gleiches Einkommen)</option>
            <option value="5">V - Verheiratete (niedrigeres Einkommen)</option>
            <option value="6">VI - Mehrere Arbeitgeber</option>
          </select>
        </div>

        <div class="input-group">
          <label>Anzahl der Kinder</label>
          <input v-model.number="inputs.kinder" type="number" min="0" placeholder="0">
        </div>

        <div class="input-group">
          <label>Krankenversicherung</label>
          <select v-model.number="inputs.pkv">
            <option value="0">Gesetzlich versichert</option>
            <option value="1">Privat versichert</option>
          </select>
        </div>

        <div class="input-group">
          <label>Zusatzbeitragssatz KV (%) - nur gesetzlich</label>
          <input v-model.number="inputs.kvz" type="number" step="0.01" placeholder="2.90" min="0">
        </div>

        <div class="input-group">
          <label>Religionszugehörigkeit</label>
          <select v-model.number="inputs.religion">
            <option value="0">Keine / Ausgetretene</option>
            <option value="1">Kirchensteuer pflichtig</option>
          </select>
        </div>

        <button @click="calculate" class="calc-button">Berechnen</button>
      </div>

      <!-- Result Section -->
      <div class="result-section" v-if="results.calculated">
        <h2>Berechnungsergebnisse</h2>
        
        <div class="result-group">
          <div class="result-item">
            <span>Jahresbruttolohn:</span>
            <span class="value">{{ formatCurrency(inputs.jahresbruttogehalt) }}</span>
          </div>

          <div class="separator"></div>

          <div class="result-item highlight">
            <span>Lohnsteuer (Jahres):</span>
            <span class="value">{{ formatCurrency(results.lohnsteuer) }}</span>
          </div>

          <div class="result-item">
            <span>Lohnsteuer (Monatlich):</span>
            <span class="value">{{ formatCurrency(results.lohnsteuer / 12) }}</span>
          </div>

          <div class="separator"></div>

          <div class="result-item highlight">
            <span>Solidaritätszuschlag:</span>
            <span class="value">{{ formatCurrency(results.solidaritaetszuschlag) }}</span>
          </div>

          <div class="separator"></div>

          <div class="result-item" v-if="inputs.religion === 1">
            <span>Bemessungsgrundlage Kirchenlohnsteuer:</span>
            <span class="value">{{ formatCurrency(results.kirchensteuer) }}</span>
          </div>

          <div class="separator"></div>

          <div class="result-item">
            <span>Rentenversicherung:</span>
            <span class="value">{{ formatCurrency(results.rentenversicherung) }}</span>
          </div>

          <div class="result-item">
            <span>Arbeitslosenversicherung:</span>
            <span class="value">{{ formatCurrency(results.arbeitslosenversicherung) }}</span>
          </div>

          <div class="result-item">
            <span>Krankenversicherung:</span>
            <span class="value">{{ formatCurrency(results.krankenversicherung) }}</span>
          </div>

          <div class="result-item">
            <span>Pflegeversicherung:</span>
            <span class="value">{{ formatCurrency(results.pflegeversicherung) }}</span>
          </div>

          <div class="separator"></div>

          <div class="result-item total">
            <span>Gesamte Sozialabgaben:</span>
            <span class="value">{{ formatCurrency(results.sozialabgaben) }}</span>
          </div>

          <div class="result-item total">
            <span>Gesamte Steuern:</span>
            <span class="value">{{ formatCurrency(results.steuern) }}</span>
          </div>

          <div class="separator"></div>

          <div class="result-item final">
            <span>Nettoeinkommen (Jahres):</span>
            <span class="value">{{ formatCurrency(results.nettoeinkommen) }}</span>
          </div>

          <div class="result-item final">
            <span>Nettoeinkommen (Monatlich):</span>
            <span class="value">{{ formatCurrency(results.nettoeinkommen / 12) }}</span>
          </div>

          <div class="result-item final">
            <span>Effektiver Steuersatz:</span>
            <span class="value">{{ results.effektiverSteuersatz.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputs: {
        jahresbruttogehalt: 50000,
        steuerklasse: 1,
        kinder: 0,
        pkv: 0,
        kvz: 2.9,
        religion: 0,
      },
      results: {
        calculated: false,
        lohnsteuer: 0,
        solidaritaetszuschlag: 0,
        kirchensteuer: 0,
        rentenversicherung: 0,
        arbeitslosenversicherung: 0,
        krankenversicherung: 0,
        pflegeversicherung: 0,
        sozialabgaben: 0,
        steuern: 0,
        nettoeinkommen: 0,
        effektiverSteuersatz: 0,
      }
    }
  },
  methods: {
    calculate() {
      const brutto = this.inputs.jahresbruttogehalt;
      
      // Konstanten 2026
      const grundfreibetrag = 12348;
      const kinderfreibetrag = 4878;
      const solzfreibetrag = 20350;
      const bbgKRV = 101400;
      const bbgKV = 69750;
      
      // Beitragssätze 2026
      const rvsatzan = 0.093; // 9,3%
      const alvsatzan = 0.013; // 1,3%
      const pvsatzan = this.inputs.pkv === 0 ? 0.018 : 0; // 1,8% oder 0%
      const kvsatzan = this.inputs.pkv === 0 
        ? (this.inputs.kvz / 2 / 100) + 0.07 
        : 0;

      // Berechnung der Einkünfte nach Freibeträgen
      let zvE = brutto - grundfreibetrag;
      
      // Kinderfreibeträge
      const kfb = this.inputs.kinder * kinderfreibetrag;
      
      // Bei Steuerklasse II zusätzlicher Entlastungsbetrag
      let efb = 0;
      if (this.inputs.steuerklasse === 2) {
        efb = 4260;
      }
      
      // Zu versteuerndes Einkommen
      zvE = zvE - kfb - efb;
      zvE = zvE < 0 ? 0 : zvE;

      // Tarifliche Einkommensteuer (vereinfachte Berechnung)
      let st = 0;
      
      if (zvE > 0) {
        if (zvE <= 17799) {
          // bis 17.799 Euro
          st = zvE * 0.14;
        } else if (zvE <= 69879) {
          // 17.800 - 69.879 Euro
          const y = (zvE - 17799) / 10000;
          st = (973.99 * y + 1400) * y;
        } else if (zvE <= 277826) {
          // 69.880 - 277.825 Euro
          const y = (zvE - 69879) / 10000;
          st = (226.40 * y + 9136.63) * y + 44742.36;
        } else {
          // ab 277.826 Euro
          st = zvE * 0.42 - 116572.5;
        }
      }

      // Kinderrabatt (Steuerersparnis durch Kinderfreibeträge)
      const kinderrabatt = kfb * 0.42;
      st = st - kinderrabatt > 0 ? st - kinderrabatt : 0;
      
      // Splitting bei Steuerklasse III und IV
      if (this.inputs.steuerklasse === 3 || this.inputs.steuerklasse === 4) {
        st = st * 1;
      } else if (this.inputs.steuerklasse === 5) {
        st = st * 1.1;
      } else if (this.inputs.steuerklasse === 6) {
        st = st * 1.15;
      }

      const lohnsteuer = Math.round(st);

      // Solidaritätszuschlag (5,5% auf Lohnsteuer über Freigrenze)
      let solz = 0;
      const jbmg = lohnsteuer;
      
      if (this.inputs.steuerklasse === 3) {
        const solzfrei_st = solzfreibetrag * 2;
        if (jbmg > solzfrei_st) {
          solz = (jbmg - solzfrei_st) * 0.055;
        }
      } else {
        if (jbmg > solzfreibetrag) {
          solz = (jbmg - solzfreibetrag) * 0.055;
        }
      }

      const solidaritaetszuschlag = Math.round(solz);

      // Kirchenlohnsteuer (Bemessungsgrundlage)
      const kirchensteuer = this.inputs.religion === 1 ? lohnsteuer : 0;

      // Sozialversicherungsbeiträge
      const rentenversicherung = Math.round(Math.min(brutto, bbgKRV) * rvsatzan);
      const arbeitslosenversicherung = Math.round(Math.min(brutto, bbgKRV) * alvsatzan);
      
      let krankenversicherung = 0;
      let pflegeversicherung = 0;
      
      if (this.inputs.pkv === 0) {
        krankenversicherung = Math.round(Math.min(brutto, bbgKV) * kvsatzan);
        pflegeversicherung = Math.round(Math.min(brutto, bbgKV) * pvsatzan);
      }

      const sozialabgaben = rentenversicherung + arbeitslosenversicherung + 
                            krankenversicherung + pflegeversicherung;
      const steuern = lohnsteuer + solidaritaetszuschlag;
      const nettoeinkommen = brutto - steuern - sozialabgaben;
      const effektiverSteuersatz = (steuern / brutto) * 100;

      this.results = {
        calculated: true,
        lohnsteuer,
        solidaritaetszuschlag,
        kirchensteuer,
        rentenversicherung,
        arbeitslosenversicherung,
        krankenversicherung,
        pflegeversicherung,
        sozialabgaben,
        steuern,
        nettoeinkommen,
        effektiverSteuersatz,
      };
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }
  },

  mounted() {
    this.calculate();
  }
}
</script>

<style scoped>

</style>
