import { Knex } from 'knex'
import { readFileSync } from 'fs'
import { join } from 'path'
import knexConfig from './knexfile' // relative path mush be used.

const migrationsDirectory = knexConfig?.migrations?.directory

if (typeof migrationsDirectory !== 'string' || !migrationsDirectory) {
  throw new Error(`knexConfig.migrations.directory must be defined in knexfile`)
}

const fileNameToString = (fileName: string) =>
  readFileSync(join(migrationsDirectory, 'sql', fileName), 'utf8')

export default function createMigration(baseName: string): Knex.Migration {
  return {
    up: (knex: Knex) => knex.raw(fileNameToString(`${baseName}_up.sql`)),
    down: (knex: Knex) => knex.raw(fileNameToString(`${baseName}_down.sql`)),
  }
}
