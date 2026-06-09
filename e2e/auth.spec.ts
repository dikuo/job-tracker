import {test, expect} from "@playwright/test";

test.describe('Job Traacker', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/login')
        await page.fill('input[type="email"]', 'hikaru@hinata.com')
        await page.fill('input[type="password"]', 'hikaruhinata')
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL('/dashboard')
    })

    test('user can login', async ({page}) => {
        await expect(page).toHaveURL('/dashboard')
    })

    test('user can add a job', async ({page}) => {
        await page.goto('/jobs')
        await page.getByRole('button', {name: '+ Add Job'}).click()
        await page.getByPlaceholder('Apple').fill('Anthropic')
        await page.getByPlaceholder('Software engineer').fill('SDE')
        await page.getByRole('button', {name: 'Submit'}).click()
        await expect(page.getByText('Anthropic')).toBeVisible()
    })

    test('user can delete a job', async ({page}) => {
        await page.goto('/jobs')
        const firstCompany = await page.locator('h3').first().innerText()
        await page.getByRole('button', {name: 'Delete'}).first().click()
        await expect(page.getByText(firstCompany)).not.toBeVisible()
    })
})