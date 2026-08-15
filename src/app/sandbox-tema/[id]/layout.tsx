import { Metadata } from 'next';
import { supabase } from '../../../utils/supabase';
import {
  atmaFont,
  averiaFont,
  breeSerifFont,
  cookieFont,
  bethFont,
  bungeeFont,
  bungeeInlineFont,
  karlaFont,
  playfairDisplayFont,
  arefRuqaaFont,
} from '../../../utils/fonts';

type Props = {
  params: Promise<{ id: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { data: invitation } = await supabase
      .from('invitations')
      .select('full_name, type, theme, layout_config, created_at, event_date, child_photo_url, gallery_images')
      .eq('id', resolvedParams.id)
      .single();

    if (!invitation) {
      return {
        title: 'Undangan Spesial Bintarti',
        description: 'Undangan Spesial Bintarti'
      };
    }
    
    const childName = invitation.full_name || 'Tamu Undangan';
    const typeMap: Record<string, string> = {
      "Birthday": "Ulang Tahun",
      "Khitan": "Khitan",
      "Aqiqah": "Aqiqah",
      "Wedding": "Pernikahan"
    };
    const invType = typeMap[invitation.type] || invitation.type || "Spesial";
    
    // Determine title
    let title = `Undangan ${invType}: ${childName}`;
    if (invitation.type === "Wedding") {
      title = `The Wedding of ${childName}`;
    }
    
    // Determine description (event date)
    let description = 'Kami mengundang Bapak/Ibu/Saudara/i untuk hadir.';
    let eventDate = '';
    
    const rawDate = invitation.layout_config?.acara?.date || invitation.event_date;
    if (rawDate) {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        eventDate = d.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    }
    
    if (eventDate) {
      if (invitation.type === "Wedding") {
        description = `Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami pada ${eventDate}.`;
      } else {
        description = `Acara: ${childName} pada ${eventDate}`;
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bintarti.store';
    const ogImageUrl = `${siteUrl}/api/og?id=${resolvedParams.id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Undangan Spesial Bintarti',
      description: 'Undangan Spesial Bintarti'
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${atmaFont.variable} ${averiaFont.variable} ${breeSerifFont.variable} ${cookieFont.variable} ${bethFont.variable} ${bungeeFont.variable} ${bungeeInlineFont.variable} ${karlaFont.variable} ${playfairDisplayFont.variable} ${arefRuqaaFont.variable} contents`}>
      {children}
    </div>
  );
}
