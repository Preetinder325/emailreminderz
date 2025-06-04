import { NextResponse } from 'next/server';
import { db } from '../../../utils/firebaseAdmin'; // ✅ Correct path for Admin SDK

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerEmail, managerEmail, workEmail, reason, date, time } = body;

    const sendAt = new Date(`${date}T${time}:00`);

    const data = {
      customerEmail,
      managerEmail,
      workEmail,
      reason,
      sendAt,
      sent: false,
    };

    const docRef = await db.collection('reminderz').add(data); // ✅ Admin SDK method

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
