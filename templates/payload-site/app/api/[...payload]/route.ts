import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import config from '@payload-config'
import { NextRequest } from 'next/server'

type Args = { params: Promise<{ payload: string[] }> }

export const GET = (req: NextRequest, { params }: Args) => REST_GET(config)(req, { params: params.then(p => ({ slug: p.payload })) })
export const POST = (req: NextRequest, { params }: Args) => REST_POST(config)(req, { params: params.then(p => ({ slug: p.payload })) })
export const DELETE = (req: NextRequest, { params }: Args) => REST_DELETE(config)(req, { params: params.then(p => ({ slug: p.payload })) })
export const PATCH = (req: NextRequest, { params }: Args) => REST_PATCH(config)(req, { params: params.then(p => ({ slug: p.payload })) })
export const PUT = (req: NextRequest, { params }: Args) => REST_PUT(config)(req, { params: params.then(p => ({ slug: p.payload })) })
export const OPTIONS = (req: NextRequest, { params }: Args) => REST_OPTIONS(config)(req, { params: params.then(p => ({ slug: p.payload })) })
