// index.mjs
import JestHasteMap from 'jest-haste-map'
import { cpus } from 'os'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { Worker } from 'jest-worker'
import { join } from 'path'

// index.mjs
import { runTest } from './worker.js'

// Get the root path to our project (Like `__dirname`).
const root = dirname(fileURLToPath(import.meta.url))
const worker = new Worker(join(root, 'worker.js'), {
  enableWorkerThreads: true
})
const hasteMapOptions = {
  extensions: ['js'],
  maxWorkers: cpus().length,
  name: 'best-test-framework',
  platforms: [],
  rootDir: root,
  roots: [root]
}
// Need to use `.default` as of Jest 27.
const hasteMap = new JestHasteMap.default(hasteMapOptions)
// This line is only necessary in `jest-haste-map` version 28 or later.
await hasteMap.setupCachePath(hasteMapOptions)

const { hasteFS } = await hasteMap.build()
const testFiles = hasteFS.matchFilesWithGlob(['**/*.test.js'])

// console.log(testFiles)

await Promise.all(
  Array.from(testFiles).map(async testFile => {
    const testResult = await worker.runTest(testFile)
    console.log(testResult)
  })
)

worker.end()
