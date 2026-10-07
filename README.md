# Examinationsuppgift A2 - Beskrivande statistik och AI-samarbete

## Introduktion

I denna examinationsuppgift ska du slutföra ett påbörjat projekt som syftar till att presentera beskrivande statistik över stora datamängder.

Beskrivande statistik (eller _deskriptiv statistik_; eng. "_descriptive statistics_") är ett sätt att reducera stora datamängder för att presentera en sammanfattning av datamängden.

I dagens utvecklingsmiljö är generativ AI (såsom ChatGPT, GitHub Copilot eller Claude) en naturlig del av en programmerares vardag. Denna uppgift fokuserar därför inte bara på att producera kod, utan på din förmåga att agera "Tech Lead" över dina AI-verktyg. Du ska kunna granska, validera och förklara den kod som levereras.

## Uppgift

Din uppgift är att slutföra implementationen av modulen `statistics.js` vars exporterade funktioner kan användas för att reducera den datamängd som skickas som argument, i form av en array med värden av typen `number`, till dem.

Du ska också skriva ett reflektionsdokument där du analyserar kodens prestanda och ditt samarbete med AI.

Det är viktigt att du följer anvisningarna för `src/statistics.js` då modulerna `src/app.js` och `test/statistics.test.js` använder sig av den enligt beroendediagrammet nedan.

![Beroendediagram](./.readme/dependency-graph.svg)

### src/statistics.js

Modulen ska exportera funktioner som kan bestämma maximum- och minimumvärden, variationsbredd ("_range_"), medelvärde ("_average_"), median, standardavvikelse ("_standard deviation_") samt typvärde ("_mode_", som kan vara en array med värden). Det ska även finnas en funktion som returnera ett objekt innehållande samtliga värden. Objektets egenskapers namn och typ framgår av JSDOC-kommentaren av den egendefinierade typen `StatisticalSummary`, som du finner i modulen.

Ett typvärde definieras som det värde, eller de värden, som förekommer flest antal gånger i en uppsättning av värden. Om alla värden i en uppsättning av värden förekommer med samma frekvens finns det inget typvärde, och funktionen `mode` (samt egenskapen `mode` i `summary`) ska då returnera `undefined`.

```js
/**
 * Represents statistical summary.
 *
 * @typedef {object} StatisticalSummary
 * @property {number} average - The average value.
 * @property {number} maximum - The maximum value.
 * @property {number} median - The median value.
 * @property {number} minimum - The minimum value.
 * @property {number[]|undefined} mode - The mode value.
 * @property {number} range - The range value.
 * @property {number} standardDeviation - The standard deviation value.
 */

// TODO: Write your code here.

/**
 * Returns several descriptive statistics (average, maximum, median, minimum,
 * mode, range and standard deviation) from a set of numbers.
 *
 * @param {number[]} numbers - The set of data to be analyzed.
 * @throws {TypeError} The passed argument is not an array.
 * @throws {Error} The passed array contains no elements.
 * @throws {TypeError} The passed array may only contain valid numbers.
 * @returns {StatisticalSummary} An object whose properties correspond to the descriptive statistics from the data set.
 */
export function summary(numbers) {
  // TODO: Write your code here.
}
```

Funktionerna `average` (#1), `maximum` (#2), `median` (#3), `minimum` (#4), `mode` (#5), `range` (#6) och `standardDeviation` (#7), ska exporteras varför dessa måste skapas och implementeras. Funktionen `summary` (#8) är påbörjad och exporteras men måste även den implementeras.

Exporterade funktioner i modulen `statistics.js` får inte ha några som helst sidoeffekter, utan ska var så kallade "_pure functions_". (#10) De exporterade funktionerna måste vidare klara av att hantera arrayer med ett stort antal element. (#15)

De exporterade funktionerna ska validera argument som skickas med och kasta undantag om kraven inte uppfylls (#9). Ingen av de exporterade funktionerna får hantera några undantag (#14).

- Anropas någon av funktionerna med ett argument som inte är en array ska ett undantag av typen `TypeError` kastas innehållande meddelandet `The passed argument is not an array.`.
- Anropas någon av funktionerna med ett argument som refererar till en tom array, ska ett undantag av typen `Error` kastas innehållande meddelandet `The passed array contains no elements.`.
- Anropas någon av funktionerna med ett argument som refererar till en array vars element innehåller annat än bara värden av typen `Number`, ska ett undantag av typen `TypeError` kastas innehållande meddelandet `The passed array may only contain valid numbers.`. __OBS!__ Värdet `Number.NaN` ska inte räknas som ett godkänt värde trots att det är av typen `Number`.

### Krav på Reflektionsdokument (`REFLECTION.md`)

Du ska skapa och lämna in en fil döpt till `REFLECTION.md` i rotkatalogen. Dokumentet ska besvara följande tre delar på ett koncist sätt. (#17)

1. __AI-samarbeteslogg:__ Beskriv kort hur du använde AI-verktyg för att lösa uppgiften. Ge exempel på minst en prompt som gav ett bra resultat, och en prompt som gav ett felaktigt eller otillfredsställande resultat (samt hur du korrigerade det).
2. __Algoritm- och prestandaanalys:__ Undersök hur din (eller AI-verktygets) kod hittar värdet för `median`. Sorteras arrayen? Vad händer med exekveringstiden och minnesåtgången om den medföljande `LARGE_ARRAY` skulle växa från 500 000 element till 50 000 000 element med den valda metoden?
3. __Källkritik vid defensiv programmering:__ Förklara hur din kod validerar att arrayen bara innehåller giltiga tal. Varför räcker det inte med att bara använda JavaScripts inbyggda `typeof` eller `isNaN()` rakt av? Ge exempel på en datatyp eller ett värde (t.ex. `null` eller `true`) som kan slinka igenom om valideringen är för svag.

### Icke funktionella krav

Gör tillräckligt många "commits", minst 15, för att det ska vara möjligt att följa hur applikationen vuxit fram över tid. (#16)

All källkod måste följa kursens kodstandard. (#13)

Undvik om lämpligt att upprepa kod och bryt därför inte mot principen DRY ("Don't Repeat Yourself"). (#12)

Dokumentera __alla__ funktioner genom att använda JSDOC-kommentarer. Använd även radkommentarer inuti funktioner i de fall det är befogat. (#11)

## Tips

- Medelvärde, median, typvärde och variationsbredd, [http://www.matteboken.se/lektioner/matte-1/sannolikhet-och-statistik/medelvarde-median-typvarde-och-variationsbredd](http://www.matteboken.se/lektioner/matte-1/sannolikhet-och-statistik/medelvarde-median-typvarde-och-variationsbredd)
- Standardavvikelse, [http://www.matteboken.se/lektioner/matte-2/statistik/standardavvikelse](http://www.matteboken.se/lektioner/matte-2/statistik/standardavvikelse)
- Genom att köra enhetstesterna som kommer med examinationsuppgiften kan du undersöka om koden du skrivit löst uppgiften (i alla fall enligt bifogade enhetstester...). Tänk på att testerna bara kontrollerar funktionalitet, inte algoritmisk effektivitet eller dolda sidoeffekter.
