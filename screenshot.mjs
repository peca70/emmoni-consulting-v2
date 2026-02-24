import puppeteer from 'puppeteer'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const screenshotDir = join(__dirname, 'temporary screenshots')

// Ensure screenshot directory exists
if (!existsSync(screenshotDir)) {
  mkdirSync(screenshotDir, { recursive: true })
}

// Get next screenshot number
const existing = readdirSync(screenshotDir).filter(f => f.startsWith('screenshot-'))
const nextNum = existing.length + 1

// Parse args
const url = process.argv[2] || 'http://localhost:3000'
const label = process.argv[3] || ''
const filename = label
  ? `screenshot-${nextNum}-${label}.png`
  : `screenshot-${nextNum}.png`

const outputPath = join(screenshotDir, filename)

async function takeScreenshot() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

  // Wait a moment for animations to settle
  await new Promise(r => setTimeout(r, 1500))

  await page.screenshot({ path: outputPath, fullPage: true })
  console.log(`Screenshot saved: ${outputPath}`)
  await browser.close()
}

takeScreenshot().catch(err => {
  console.error('Screenshot failed:', err.message)
  process.exit(1)
})
