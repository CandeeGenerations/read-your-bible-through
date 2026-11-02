/* oxlint-disable no-undef, no-console */
/*
 * Who is the Operator, and who is left out of what they see - written by hand, never by a
 * route (docs/operator-plan.md in the app's repo).
 *
 *   phase run --env Production 'pnpm operator:add <email>'        an Operator
 *   phase run --env Production 'pnpm operator:leave-out <email>'  left out of the people, totals and charts
 *
 * Finds the account by its own email or any of its sign-in methods', says who it found, and
 * asks before writing.
 */
import {PrismaClient} from '@prisma/client'
import readline from 'readline/promises'

const prisma = new PrismaClient()

const main = async (): Promise<void> => {
  const [command, email] = process.argv.slice(2)

  if (!['add', 'leave-out'].includes(command) || !email) {
    console.error('usage: operator.ts add|leave-out <email>')
    process.exitCode = 1
    return
  }

  const method = await prisma.signInMethod.findFirst({where: {email}, select: {userId: true}})
  const user = await prisma.user.findFirst({
    where: method ? {id: method.userId} : {email},
    select: {id: true, name: true, email: true, signInMethods: {select: {provider: true, email: true}}},
  })

  if (!user) {
    console.error(`No account has ${email}`)
    process.exitCode = 1
    return
  }

  const methods = user.signInMethods.map((m) => `${m.provider} ${m.email ?? ''}`.trim()).join(', ') || 'none stored'
  console.log(`${user.name} <${user.email}> ${user.id} - ${methods}`)

  const rl = readline.createInterface({input: process.stdin, output: process.stdout})
  const answer = await rl.question(command === 'add' ? 'Make them an Operator? [y/N] ' : 'Leave them out? [y/N] ')
  rl.close()

  if (answer.trim().toLowerCase() !== 'y') return

  const data = {userId: user.id, addedAt: new Date().toISOString()}

  if (command === 'add') {
    await prisma.operator.upsert({where: {userId: user.id}, create: data, update: {}})
  } else {
    await prisma.operatorLeavesOut.upsert({where: {userId: user.id}, create: data, update: {}})
  }

  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
