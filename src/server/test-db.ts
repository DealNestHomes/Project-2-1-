import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
  const prisma = new PrismaClient()
  try {
    const count = await prisma.dealSubmission.count()
    console.log(`Successfully connected! Found ${count} deals.`)
  } catch (e) {
    console.error('Connection failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
