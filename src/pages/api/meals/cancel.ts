import type { APIRoute } from 'astro';
import { getUser } from '../../../lib/auth';
import { cancelMeal } from '../../../lib/meals';
import { z } from 'zod';

const cancelSchema = z.object({
  mealId: z.string().uuid()
});

export const post: APIRoute = async ({ request, redirect }) => {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const mealId = formData.get('mealId') as string;

  try {
    const validatedData = cancelSchema.parse({ mealId });
    await cancelMeal(user.id, validatedData.mealId);
    return redirect('/dashboard/meals');
  } catch (error) {
    return new Response('Invalid data', { status: 400 });
  }
};