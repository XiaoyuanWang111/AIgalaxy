import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const config = await prisma.feedbackConfig.findFirst()
    return NextResponse.json({ config })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feedback config' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { productFeedbackUrl, platformFeedbackUrl } = body

    const existingConfig = await prisma.feedbackConfig.findFirst()
    
    if (existingConfig) {
      const updated = await prisma.feedbackConfig.update({
        where: { id: existingConfig.id },
        data: { productFeedbackUrl, platformFeedbackUrl }
      })
      return NextResponse.json({ config: updated })
    } else {
      const created = await prisma.feedbackConfig.create({
        data: { productFeedbackUrl, platformFeedbackUrl }
      })
      return NextResponse.json({ config: created })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feedback config' }, { status: 500 })
  }
}