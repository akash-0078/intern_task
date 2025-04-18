// app/api/send-feedback/route.ts
import { db } from "@lib/firebaseAdmin";
// import { transporter } from "@/lib/mail"; 
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message, email } = await req.json();

    if (!message || !email) {
      return NextResponse.json({ error: "Missing message or email" }, { status: 400 });
    }

    // 1. Store feedback in Firestore
    await db.collection("feedbacks").add({
      email,
      message,
      timestamp: new Date(),
    });

    console.log(`Stored feedback from ${email}:`, message);

    // 2. Send thank-you email
    // await transporter.sendMail({
    //   from: process.env.EMAIL_FROM,
    //   to: email,
    //   subject: "Thank You for Your Feedback!",
    //   html: `<p>Hi there,</p><p>Thanks a lot for your feedback! We really appreciate your time and support 😊</p>`,
    // });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving feedback or sending email:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
