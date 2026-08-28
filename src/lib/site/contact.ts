import "server-only";

function publicValue(value: string | undefined) {
  return value?.trim() || null;
}

function phoneHref(phone: string | null) {
  if (!phone) return null;
  const dialable = phone.replace(/[^\d+*#,;]/g, "");
  return dialable ? `tel:${dialable}` : null;
}

export function getPublicContact() {
  const phone = publicValue(process.env.PUBLIC_CONTACT_PHONE);
  const email = publicValue(process.env.PUBLIC_CONTACT_EMAIL);
  const address = publicValue(process.env.PUBLIC_CONTACT_ADDRESS);
  const quoteEmail = publicValue(process.env.PUBLIC_QUOTE_EMAIL) ?? email;

  return {
    phone,
    email,
    address,
    quoteEmail,
    phoneHref: phoneHref(phone),
    emailHref: email ? `mailto:${email}` : null,
    quoteEmailHref: quoteEmail ? `mailto:${quoteEmail}` : null,
  };
}
