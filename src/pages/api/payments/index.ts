import type { APIRoute } from 'astro';
import { getUser } from '../../../lib/auth';
import { createPayment, getMonthlyPaymentStatus } from '../../../lib/payments';
import { z } from 'zod';

const paymentSchema = z.object({
  amount: z.number().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Format invalide pour le mois (YYYY-MM)')
});

export const post: APIRoute = async ({ request, redirect }) => {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const amount = Number(formData.get('amount'));
  const month = formData.get('month') as string;

  try {
    const validatedData = paymentSchema.parse({ amount, month });
    
    // Check if payment already exists for this month
    const existingPayment = await getMonthlyPaymentStatus(user.id, validatedData.month);
    if (existingPayment) {
      return new Response('Payment already exists for this month', { status: 400 });
    }

    await createPayment(user.id, validatedData.amount, validatedData.month);
    return redirect('/dashboard/payments');
  } catch (error) {
    return new Response('Invalid data', { status: 400 });
  }
};