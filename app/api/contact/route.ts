import { NextResponse } from "next/server";

const resendEndpoint = "https://api.resend.com/emails";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  civilite?: unknown;
  nom?: unknown;
  email?: unknown;
  telephone?: unknown;
  demande?: unknown;
  message?: unknown;
  rgpd?: unknown;
  website?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildTextEmail({
  civilite,
  nom,
  email,
  telephone,
  demande,
  message,
}: {
  civilite: string;
  nom: string;
  email: string;
  telephone: string;
  demande: string;
  message: string;
}) {
  return [
    "Nouvelle demande de contact depuis expertisesdemaison.be",
    "",
    `Civilité: ${civilite || "-"}`,
    `Nom: ${nom}`,
    `E-mail: ${email}`,
    `Téléphone: ${telephone || "-"}`,
    `Type de demande: ${demande}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "stephanie.marcelis@hotmail.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      { message: "Le service d'envoi n'est pas encore configuré." },
      { status: 500 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ message: "La demande est invalide." }, { status: 400 });
  }

  if (clean(body.website)) {
    return NextResponse.json({ success: true });
  }

  const civilite = clean(body.civilite);
  const nom = clean(body.nom);
  const email = clean(body.email);
  const telephone = clean(body.telephone);
  const demande = clean(body.demande);
  const message = clean(body.message);
  const rgpd = body.rgpd === true;

  if (!nom || !email || !demande || !message || !rgpd) {
    return NextResponse.json(
      { message: "Merci de compléter tous les champs obligatoires." },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ message: "L'adresse e-mail est invalide." }, { status: 400 });
  }

  const emailText = buildTextEmail({ civilite, nom, email, telephone, demande, message });

  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Nouvelle demande de rendez-vous - ${nom}`,
      text: emailText,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "L'e-mail n'a pas pu être envoyé. Merci de réessayer." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
