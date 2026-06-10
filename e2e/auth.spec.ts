import { test, expect } from "@playwright/test";

test.describe('Auth', () => {
    test('user sees error on wrong password', async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[type="email"]', "hikaru@hinata.com")
        await page.fill('input[type="password"]', "wrongpassword")
        await page.click('button[type="submit"]')
        await expect(page.getByText('Wrong password.')).toBeVisible()
    })

    test('user cannot access /jobs without login', async ({page}) => {
        await page.goto('/jobs')
        await expect(page).toHaveURL('/login')
    })
})

test.describe('Job Traacker', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[type="email"]', 'hikaru@hinata.com')
        await page.fill('input[type="password"]', 'hikaruhinata')
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL('/dashboard')
    })

    test('user can login', async ({ page }) => {
        await expect(page).toHaveURL('/dashboard')
    })

    test('user can add a job', async ({ page }) => {
        await page.goto('/jobs')
        await page.getByRole('button', { name: '+ Add Job' }).click()
        await page.getByPlaceholder('Apple').fill('Anthropic')
        await page.getByPlaceholder('Software engineer').fill('SDE')
        await page.getByRole('button', { name: 'Submit' }).click()
        await expect(page.getByText('Anthropic')).toBeVisible()
    })

    test('user can search jobs', async ({ page}) => {
        await page.goto('/jobs')
        await page.getByPlaceholder('🔍 Search...').fill('Anthropic')
        await expect(page.locator('h3', { hasText: 'Anthropic'})).toBeVisible()
    })

    test('user can view job detail', async ({ page }) => {
        await page.goto('/jobs')
        await page.locator('.space-y-4 > div').first().click()
        await expect(page).toHaveURL(/\/jobs\//)
    })

    test('user can edit a job', async ({ page }) => {
        await page.goto('/jobs')
        await page.locator('.space-y-4 > div').first().click()
        await page.getByRole('button', { name: '✏️ Edit'}).click()
        await page.getByLabel('Salary').fill('999')
        await page.getByRole('button', { name: "Save Changes"}).click()
        await expect(page.getByText('999')).toBeVisible()
    })

    test('user can delete a job', async ({ page }) => {
        await page.goto('/jobs')
        const firstCompany = await page.locator('h3').first().innerText()
        await page.getByRole('button', { name: 'Delete' }).first().click()
        await expect(page.getByText(firstCompany)).not.toBeVisible()
    })

    test('user can toggle dark mode', async ({page}) => {
        await page.goto('/jobs')
        await page.getByText('🌙').click()
        await expect(page.locator('html')).toHaveClass(/dark/)
        await page.getByText('☀️').click()
        await expect(page.locator('html')).not.toHaveClass(/dark/)
    })

    test('user can fetch new job', async ({ page }) => {
        await page.goto('/job-search')
        await page.getByRole('button', {name: 'Search'}).click()
        await expect(page.getByText('Apply 🔗').first()).toBeVisible()
    })
})