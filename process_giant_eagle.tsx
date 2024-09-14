// Process Giant Eagle
// web requests and return results

import puppeteer from "puppeteer";
import fs from "fs";
import { parse } from "csv-parse";
import convert from "convert-units";

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
    const paren: RegExp = /\(([^)]+)\)/g;
    const from_unit = cost.split(" ").slice(1).join("").split("(")[0].trim();
    // Parse out the (<amount>/unit) to [amount, unit]
    const cost_per_unit = (cost.match(paren) ?? []).slice(-1)[0].split("/");
    console.log("Cost per unit for: ", cost);
    // Figure out the dollar value of the first elem
    const unit_cost = parseDollar(cost_per_unit[0]);
    const amount = Number(cost.split(" ")[0]);
    const to_unit = cost_per_unit[1].replace(")", "").trim();
    const conversion = from_unit != to_unit ? convert(amount).from(from_unit).to(to_unit) : amount;

    // Then add the units in
    return {cost: conversion * unit_cost, quantity: amount, unit: to_unit };
}

type CostInfo = {
    cost: number,
    quantity: number,
    unit: string
}

type ItemInfo = {
    name: string | null,
    cost: CostInfo | undefined
}

/**
 * Query Giant Eagle for a list of available products.
 * @param query Query to send to Giant Eagle website.
 * This is done using the headless browser puppeteer.
 */
async function getVisual(query: string) {
    let results: ItemInfo[] = [];
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
            console.log("Name", await tileNameProp.jsonValue());
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

// Get a meal plan

// (1) Read and parse all possible meal plans
// Read the content
type Meals = {
    name: string,
    ingredients: string[],
    cost?: number
}

let [meal_entries, all_meal_items]: [Meals[], string[]] = await new Promise((res, rej) => {
    let meal_entries: Meals[] = [];
    let all_meal_items: string[] = [];
    fs.createReadStream("./breakfast_options.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        // Get this meal's name and its incredients
        const meal_name = csvrow[0];
        // Its meal ingredients are placed after that
        const ingredients = csvrow.slice(1).filter(e => !!e).map(e => e.toLowerCase());
        for(let ing of ingredients) {
            // Add into meal_items, if not already in there
            if(!all_meal_items.includes(ing)) {
                all_meal_items.push(ing);
            }
        }
        meal_entries.push({ name: meal_name, ingredients: ingredients });
    })
    .on('end',function() {
      //do something with meal_entries
      console.log(meal_entries);
      // Now iterate through all the options available
      // + look up their expected cost
      console.log(meal_entries, all_meal_items);
      res([meal_entries, all_meal_items]);
    });
});

// Now take the list of all meal items and find out
// how much they cost.
const cost_list = await Promise.all(all_meal_items.map(e => getVisual(e)));
// console.log(await getVisual("kale"));

// Now that we have a list of all the costs,
// select the first item from each result +
// use to compute the cost of each meal item
meal_entries = meal_entries.map(meals => {
    let total_cost = 0;
    for(let ing of meals.ingredients) {
        // Get the index of the location to find the price
        const index_of_price = all_meal_items.indexOf(ing);
        // Just use the first result
        const cost_entry = cost_list[index_of_price][0].cost;
        if(!cost_entry) {
            console.warn(`Warning: could not find ${ing} in fetched information.`);
            continue;
        }
        console.log("Adding cost: ", cost_entry.cost, cost_list[index_of_price][0].name, meals.name);
        total_cost += (cost_entry.cost ?? 0);
    }
    console.log(`Total cost of meal (${meals.name}): ${total_cost}`);
    return { ...meals, cost: total_cost};
});
