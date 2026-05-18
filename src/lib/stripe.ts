import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2025-04-30.basil' })
  : null

export const ALLOWED_CARD_BRANDS = ['visa', 'mastercard', 'unionpay']
