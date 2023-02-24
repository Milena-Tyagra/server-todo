import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod' 

const prisma = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {
  const fastify = Fastify({
    // emite logs para monitorar a aplicação
    logger: true
  })

  await fastify.register(cors, {
    origin: true,
  })

  fastify.get('/cards', async () => {
    const cards = await prisma.card.findMany()
    return { cards }
  })

  fastify.post('/cards', async(request, response) => {
    const createCardBody = z.object({
      title: z.string(),
      board: z.string(),
    })
    const { board, title } = createCardBody.parse(request.body)
    await prisma.card.create({
      data: {
        title,
        board
      }
    })
    return response.status(201).send({ title })
  })

  fastify.put("/cards", async (request, response) => {
    const { board, id } = request.body
    const updateUser = await prisma.card.update({
      where: {
        id
      },
      data: {
        board
      },
    })
    return response.status(200).send({ board })
  })

  await fastify.listen({port:3333, host: '0.0.0.0'})
}

bootstrap()