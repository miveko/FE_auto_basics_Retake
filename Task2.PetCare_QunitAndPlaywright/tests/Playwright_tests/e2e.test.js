const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email : "",
    password : "Abc54321",
};

let pet = {
    age : "2 years",
    name : "",
    breed : "Random breed",
    image : "/images/cat-create.jpg",
    weight  : "2 kg"
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test("Registration with Valid Data ", async () => {
            //arrange
            await page.goto(host);
            await page.click('text=Register');
            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 100000);
            user.email = `email${random}@mailinator.bg`;

            //act
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.locator("#repeatPassword").fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/register") && response.status() == 200),
                page.click('[type="submit"]')
            ]);

            //assert
            expect(response.ok()).toBeTruthy();
            let userData = await response.json();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        })

        test('Login with Valid Data ', async () =>{
            //arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            //act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/login") && response.status() == 200),
                page.click('[type="submit"]')
            ]);

            //assert
            await expect(response.ok()).toBeTruthy();
            let userData = await response.json();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        })

        test('Logout from the Application', async () => {
            //arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            //act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/logout") && response.status() == 204 ),
                page.locator('nav >> text=Logout').click()
            ]);

            //assert
            expect(response.ok()).toBeTruthy();
            await page.waitForSelector('text=Login');
            expect(page.url()).toBe(host + '/');
        })
    })

    describe("navbar", () => {
        test("Navigation for Logged-In User Testing", async() => {
            //arrange
            await page.goto(host);

            //act
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            //assert
            await expect(page.locator('a[href="/"]:has-text("Home")')).toBeVisible();
            await expect(page.locator('a[href="/catalog"]:has-text("Dashboard")')).toBeVisible();
            await expect(page.locator('a[href="/create"]:has-text("Create Postcard")')).toBeVisible();
            await expect(page.locator('a[href="/logout"]:has-text("Logout")')).toBeVisible();

            await expect(page.locator('a[href="/login"]:has-text("Login")')).toBeHidden();
            await expect(page.locator('a[href="/register"]:has-text("Register")')).toBeHidden();
        })

        test('Navigation for Guest User Testing', async () =>{
            //act
            await page.goto(host);

            //assert
            await expect(page.locator('a[href="/"]:has-text("Home")')).toBeVisible();
            await expect(page.locator('a[href="/catalog"]:has-text("Dashboard")')).toBeVisible();
            await expect(page.locator('a[href="/login"]:has-text("Login")')).toBeVisible();
            await expect(page.locator('a[href="/register"]:has-text("Register")')).toBeVisible();

            await expect(page.locator('a[href="/create"]:has-text("Create Postcard")')).toBeHidden();
            await expect(page.locator('a[href="/logout"]:has-text("Logout")')).toBeHidden();

        })       
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');
        })

        test("Create a Postcard Testing", async () => {
            //arrange
            await page.click('a[href="/create"]');
            await page.waitForSelector('form');
            let random = Math.floor(Math.random() * 100000);
            pet.name = `Random name ${random}`;
            //act
            await page.fill('[id=name]', pet.name);
            await page.fill('[id=breed]', pet.breed);
            await page.fill('[id=age]', pet.age);
            await page.fill('[id=weight]', pet.weight);
            await page.fill('[id=image]', pet.image);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() == 200),
                page.click('[type="submit"]')
            ])

            //assert
            expect(response.ok()).toBeTruthy();
            let eventData = await response.json();
            expect(eventData.name).toEqual(pet.name);
            expect(eventData.breed).toEqual(pet.breed);
            expect(eventData.age).toEqual(pet.age);
            expect(eventData.weight).toEqual(pet.weight);
            expect(eventData.image).toEqual(pet.image);
        })

        test("Edit a Postcard Testing", async()=>{
            await page.click('a[href="/catalog"]');
            //verify the newly created postcard is shown
            await expect(page.locator('text=' + pet.name)).toBeVisible();
            await page.locator('a[class="btn"]').first().click();
            await page.click('text=Edit');
            await page.waitForSelector('form');

            //act            
            let random = Math.floor(Math.random() * 100000);
            pet.name = `Random Edited name ${random}`;
            pet.breed = 'Random Edited breed';
            await page.fill('[id=name]', pet.name);
            await page.fill('[id=breed]', pet.breed);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() == 200),
                page.click('[type="submit"]')
            ])

            //assert
            expect(response.ok()).toBeTruthy();
            let eventData = await response.json();
            expect(eventData.name).toEqual(pet.name);
            expect(eventData.breed).toEqual(pet.breed);
            expect(eventData.age).toEqual(pet.age);
            expect(eventData.weight).toEqual(pet.weight);
            expect(eventData.image).toEqual(pet.image);
        })

        test('Delete a Postcard Testing', async()=>{
            //act
            await page.click('a[href="/catalog"]');
            await page.locator('a[class="btn"]:has-text("Details")').first().click();
            await page.on("dialog", async (alert) => {
                await alert.accept();
            });


            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() == 200),
                page.click('text=Delete')
            ])

            //assert
            expect(response.ok()).toBeTruthy()
        })
    })
})