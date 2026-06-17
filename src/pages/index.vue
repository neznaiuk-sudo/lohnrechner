<script setup lang="ts">

import { ref,watch } from 'vue';//#endregion
import {versorgungstabellen} from '../versorgungstabellen.ts'
import krankenkassen from "../../krankenkassen.json"  
import { v } from 'vue-router/dist/index-BQLwgiyK.js';


const BBGRVALV = 101400
const BBGKVPV = 69750
const GFB = 12348
const SOLZFREI = 20350

const LZZItems =  [
  { text: 'Jahr', value: 1 },
  { text: 'Monat', value: 2 },
  { text: 'Woche', value: 3 },
  { text: 'Tag', value: 4 }
]

/*const PVAItems = [
  { text: 'Kein Abschlag', value: 0 },
  { text: 'Beitragsabschlag für das 2. Kind', value: 1 },
  { text: 'Beitragsabschläge für das 2 und 3. Kind', value: 2 },
  { text: 'Beitragsabschläge für 2 bis 4. Kinder', value: 3 },
  { text: 'Beitragsabschläge für 2 bis 5. Kind', value: 4 },
]*/
const PVAItems = [
  { text: 'Ein Kind', value: 0 },
  { text: '2 Kinder', value: 1 },
  { text: '3 Kinder', value: 2 },
  { text: '4 Kinder', value: 3 },
  { text: '5 Kinder oder mehr', value: 4 },

]

// 3.1 Eingangsparameter
let AF,
  AJAHR,
  ALTER1,
  ALV,
  F,
  JFREIB,
  JHINZU,
  JRE4,
  JRE4ENT,
  JVBEZ,
  KRV,
  KVZ = ref(0),
  LZZ = ref(2),
  LZZFREIB = 0, //default bei 0 manuele eingbe muss noch entwickelt werden
  LZZHINZU = 0, //default bei 0 manuele eingbe muss noch entwickelt werden
  MBV,
  PKPV,
  PKPVAGZ,
  PKV,
  PVA = ref(0),
  PVS,
  PVZ = ref(0),
  R,
  rawRE4 = ref(0),
  RE4:number,
  SONSTB,
  SONSTENT,
  STERBE,
  STKL,
  VBEZ = 0,
  VBEZM,
  VBEZS,
  VBS,
  VJAHR,
  ZKF,
  ZMVB

// 3.2 Ausgangsparameter
let BK,
  BKS,
  LSTLZZ,
  SOLZLZZ,
  SOLZS,
  STS

// 3.3 Ausgangsparameter DBA
let VFRB,
  VFRBS1,
  VFRBS2,
  WVFRB,
  WVFRBM,
  WVFRBO

// 4. Interne Felder
let ALTE,
  ANP,
  ANTEIL1,
  AVSATZAN,
  BMG,
  DIFF,
  EFA,
  FVB,
  FVBSO,
  FVBZ,
  FVBZSO,
  HBALTE,
  HFVB,
  HFVBZ,
  HFVBZSO,
  HOCH,
  J,
  JBMG,
  JLFREIB,
  JLHINZU,
  JW,
  K,
  KFB,
  KVSATZAN,
  KZTAB,
  LSTJAHR,
  LSTOSO,
  LSTSO,
  MIST,
  PKPVAGZJ,
  PVSATZAN,
  RVSATZAN,
  RW,
  SAP,
  SOLZJ,
  SOLZMIN,
  SOLZSBMG,
  SOLZSZVE,
  ST,
  ST1,
  ST2,
  TAB1,
  TAB2,
  TAB3,
  TAB4,
  TAB5,
  VBEZB,
  VBEZBSO,
  VERGL,
  VSPHB,
  VSP,
  VSPN,
  VSPALV,
  VSPKVPV,
  VSPR,
  W1STKL5,
  W2STKL5,
  W3STKL5,
  X,
  Y,
  ZRE4,
  ZRE4J,
  ZRE4VP,
  ZRE4VPR,
  ZTABFB,
  ZVBEZ,
  ZVBEZJ,
  ZVE,
  ZX,
  ZZX

  watch(rawRE4, (value) =>{
    RE4 = value * 100
  })
  watch(PVZ, (value) =>{
    if (value == 0){
      PVA = ref(0)
    }
  })

  //Zuweisung von Werten für bestimmte
  //Sozialversicherungs- und Steuerparameter

  function MPARA(){
    AVSATZAN = 0.0130
    RVSATZAN = 0.0930
    KVSATZAN = KVZ.value / 2 / 100 + 0.07
    PVS == 1 ? PVSATZAN = 0.023 : PVSATZAN = 0.018
    PVZ.value == 1 ? PVSATZAN = PVSATZAN - PVA.value * 0.0025 : PVSATZAN = PVSATZAN + 0.006 
    W1STKL5 = 14071
    W2STKL5 = 34939
    W3STKL5 = 222260
  }
  
  function MRE4Jl() {

    switch (LZZ.value) {
      case 1:
        ZRE4J = RE4 / 100
        ZVBEZJ = VBEZ / 100
        JLFREIB = LZZFREIB / 100
        JLHINZU = LZZHINZU / 100
        break;
      case 2:
        ZRE4J = RE4 * 12 / 100
        ZVBEZJ = VBEZ * 12 / 100
        JLFREIB = LZZFREIB * 12 / 100
        JLHINZU = LZZHINZU * 12 / 100
        break;
      case 3:
        ZRE4J = RE4 * 360 * 7 / 100
        ZVBEZJ = VBEZ * 360 * 7 / 100
        JLFREIB = LZZFREIB * 360 * 7 / 100
        JLHINZU = LZZHINZU * 360 * 7 / 100
        break;      
      case 3:
        ZRE4J = RE4 * 360 / 100
        ZVBEZJ = VBEZ * 360 / 100
        JLFREIB = LZZFREIB * 360 / 100
        JLHINZU = LZZHINZU * 360 / 100
        break;   
    }
    
    if (AF == 0) F = 1

  }

  //hollt alle krankenkassen vom .json file
  const items = krankenkassen.data.data
  .filter(k => k.zusatzbeitrag != null)
  .map(k => ({
    title: `${k.name} - ${k.zusatzbeitrag.toFixed(2)} %`,
    kvz: k.zusatzbeitrag
  }))

  const rules = {
    required: value => !!value || 'Field is required',
  }

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select 
          :items="LZZItems"
          v-model="LZZ"
          item-title="text"
          item-value="value"
          label="Zeitraum"
          variant="outlined"
          :rules="[rules.required]"
        />

        <v-text-field
          v-model.number="rawRE4"
          type="number"
          label="Bruttogehalt"
          variant="outlined"
          prefix="€"
          :rules="[rules.required]"
          clearable
        />
  
        <v-text-field
            v-model="KVZ"
            label="KV-Zusatzbeitrag"
            type="number"
            variant="outlined"
            prefix="%"

          />

        <v-select
          disabled      
          v-model="KVZ"
          :items="items"
          label="KV-Zusatzbeitrag"
          item-title="title"
          item-value="kvz"
          variant="outlined"
          :rules="[rules.required]"
          clearable
        >
        <template #prepend-item>
          <v-divider />
          <v-text-field
            v-model="KVZ"
            label="Manuell hinzufügen"
            type="number"
            variant="outlined"
          />
        </template>
        </v-select>

        
        <div class="kinder">
          <p>Haben Sie Kinder?</p>

          <v-btn-toggle
            v-model="PVZ"
            color="primary"
            class="ml-5"
            density="compact"
          >
            <v-btn :value="0">
              Nein
            </v-btn>

            <v-btn :value="1">
              Ja
            </v-btn>
          </v-btn-toggle>
        </div>

        <v-select 
          v-if="PVZ" 
          :items="PVAItems"
          v-model="PVA"
          item-title="text"
          item-value="value"
          label="Kinder"
          variant="outlined"
        />

      </v-col>
        <div class="ausgabe" >
          <p>Lohnzeitraum LZZ: {{ LZZ }}</p>
          <p>Bruttogehalt RawRE4: {{ rawRE4 }}</p>
          <p>Bruttogehalt in Cent RE4: {{ RE4 }}</p>
          <p>Krankenkasse KVZ: {{ KVZ }} %</p>
          <p>Beitragsabschläge PVA: {{ PVA }}</p>
          <p>Kinder PVZ: {{ PVZ }}</p>
        </div>
      <v-col>

      </v-col>
    </v-row>
  </v-container>
  <!--<pre>{{ items }}</pre>-->
</template>

<style scoped>
:deep(.v-field input[type="number"]::-webkit-outer-spin-button),
:deep(.v-field input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(.v-field input[type="number"]) {
  -moz-appearance: textfield;
}
.kinder{
  display: flex;
  align-items: center;
  /*justify-content: space-between;*/
  margin-bottom: 10px;
}

</style>
