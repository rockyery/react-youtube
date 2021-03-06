import jwt from 'jsonwebtoken'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function getAuthUser(req, res, next) {
    if(!req.headers.authorization) {
        req.user = null
        return next()
    }

    const token = req.headers.authorization
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id
        },
        include: {
            videos: true
        }
    })

    req.user = user
    next()
}

export async function protect(req, res, next) {
    if(!req.headers.authorization) {
        return next({
            message: 'You need to be logged in to visit this route',
            statusCode: 401
        })
    }

    try {
        const token = req.headers.authorization
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            },
            include: {
                videos: true
            }
        })

        req.user = user
        next()
    } catch (error) {
        next({
            message: "You need to be logged in to visit this route",
            statusCode: 401
        })
    }

}
