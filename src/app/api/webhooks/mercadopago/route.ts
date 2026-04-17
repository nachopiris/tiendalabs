import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * MercadoPago webhook handler.
 * Receives payment notifications and updates order status.
 *
 * @see https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
export async function POST(request: NextRequest) {
  // TODO: Validate webhook signature
  // TODO: Parse notification type and payment ID
  // TODO: Fetch payment details from MercadoPago API
  // TODO: Update order payment_status in Supabase

  const body = await request.json();

  console.log("MercadoPago webhook received:", body);

  return NextResponse.json({ received: true });
}
