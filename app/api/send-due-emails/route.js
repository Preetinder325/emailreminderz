import { NextResponse } from 'next/server';
import { db } from '../../../utils/firebaseAdmin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const now = new Date();
    const remindersRef = db.collection('reminderz');
    const snapshot = await remindersRef
      .where('sent', '==', false)
      .where('sendAt', '<=', now)
      .get();

    const emailsSent = [];

    for (const reminder of snapshot.docs) {
      const data = reminder.data();

      const emailData = {
        from: 'Reminderz <reminderz@resend.dev>',
        to: [data.customerEmail, data.managerEmail, data.workEmail],
        subject: 'Scheduled Reminder',
        text: `This is your scheduled reminder: ${data.reason}`,
      };

      const emailRes = await resend.emails.send(emailData);

      if (emailRes.id) {
        await remindersRef.doc(reminder.id).update({ sent: true });
        emailsSent.push(reminder.id);
      }
    }

    return NextResponse.json({ success: true, count: emailsSent.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
