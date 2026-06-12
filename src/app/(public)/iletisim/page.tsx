"use client";

import { StaticPage } from "@/components/pages/static-page";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <StaticPage title="İletişim">
      <p>Sorularınız ve önerileriniz için bizimle iletişime geçin.</p>

      {sent ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-neutral-300">
          Mesajınız alındı. En kısa sürede size dönüş yapacağız.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input id="name" label="Ad Soyad" required />
          <Input id="email" label="E-posta" type="email" required />
          <Input id="subject" label="Konu" required />
          <Textarea id="message" label="Mesaj" rows={5} required />
          <Button type="submit">Gönder</Button>
        </form>
      )}

      <div className="mt-8 space-y-2 text-sm text-neutral-400">
        <p><strong>E-posta:</strong> info@b2buretim.com</p>
        <p><strong>Telefon:</strong> +90 (212) 000 00 00</p>
        <p><strong>Adres:</strong> İstanbul, Türkiye</p>
      </div>
    </StaticPage>
  );
}
