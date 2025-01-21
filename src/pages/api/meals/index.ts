import type { APIRoute } from 'astro';
import { getUser } from '../../../lib/auth';
import { createMeal } from '../../../lib/meals';
import { z } from 'zod';

const mealSchema = z.object({
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "La date doit être aujourd'hui ou dans le futur")
});

export const post: APIRoute = async ({ request, redirect }) => {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const date = formData.get('date') as string;

  try {
    const validatedData = mealSchema.parse({ date });
    await createMeal(user.id, validatedData.date);
    return redirect('/dashboard/meals');
  } catch (error) {
    return new Response('Invalid data', { status: 400 });
  }
};