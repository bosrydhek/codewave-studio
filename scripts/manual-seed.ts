import { seedTestUser } from '../tests/helpers/seedUser'
import 'dotenv/config'

async function run() {
  try {
    console.log('Seeding test user...')
    await seedTestUser()
    console.log('Seed success!')
  } catch (e) {
    console.error('Seed failed:', e)
  }
}

run()
