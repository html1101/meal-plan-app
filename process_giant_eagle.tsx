// Process Giant Eagle
// web requests and return results

import puppeteer from "puppeteer";

// Take in the cost and turn it into a dollar value
const parseDollar = (cost: string) => {
    const number_part = cost.split(/ /)[0].replace(/[^!.\d]/g, '');
    if(cost.includes("¢")) {
        // This is a cent value
        return Number(number_part) / 100;
    }
    return Number(number_part);
}

const parseCost = (cost: string | null) => {
    if(!cost) return;
    // Now take the per / unit and compare it to the actual value
    const paren: RegExp = /\(([^)]+)\)/;
    // Parse out the (<amount>/unit) to [amount, unit]
    const cost_per_unit = (paren.exec(cost) ?? [])[1].split("/");
    // Figure out the dollar value of the first elem
    const unit_cost = parseDollar(cost_per_unit[0]);
    const amount = Number(cost.split(" ")[0]);

    // Then add the units in
    return {cost: amount * unit_cost, quantity: amount, unit: cost_per_unit[1] };
}

/**
 * Query Giant Eagle for a list of available products.
 * @param query Query to send to Giant Eagle website.
 * This is done using the headless browser puppeteer.
 */
async function getVisual(query: string) {
    let results: ({ [index: string]: any })[] = [];
	try {
        // URL to open up using the browser
		const URL = `https://www.gianteagle.com/grocery/search?q=${encodeURIComponent(query)}`
        // Launch the headless browser
		const browser = await puppeteer.launch();

        // Create a new page in the browser
		const page = await browser.newPage();
        // Go to the page we'd like to search
		await page.goto(URL);

        // Wait for the elements to load in the DOM before trying to parse
        await page.waitForSelector("div.ProductTile");

        // Now get the element's content
        const tileList = await page.$$('div.ProductTile .inEnYz');
        for(let tile of tileList) {
            // For each tile, get the tile's name (in .YLwtX) and
            // its cost (in .fCMVfn)
            const tileNameElem = await tile.$(".YLwtX");
            const tileCostElem = await tile.$(".fCMVfn");
            // Invalid tile
            if(!tileNameElem || !tileCostElem) continue;
            // Now get the tile's properties
            const tileNameProp = await tileNameElem.getProperty("textContent");
            const tileCostProp = await tileCostElem.getProperty("textContent");
            if(!tileNameProp || !tileCostProp) continue;

            // Now get each element's content
            results.push({
                name: await tileNameProp.jsonValue(),
                cost: parseCost(await tileCostProp.jsonValue())
            });
        }
		await browser.close();
	} catch (error) {
		console.error(error)
	}
    return results;
}

getVisual("milk")
.then(costs => {
    console.log(costs);
});