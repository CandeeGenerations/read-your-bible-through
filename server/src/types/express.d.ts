// Augment Express Request with the authenticated userId set by requireAuth.
declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export {}
