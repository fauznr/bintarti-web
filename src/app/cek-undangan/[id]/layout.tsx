import { Metadata } from 'next';
import { supabase } from '../../../utils/supabase';

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
    
    const isKhitan = invitation.type === "Khitan";
    const activeTheme = invitation.theme?.toLowerCase().replace(/\s+/g, '-') || "khitan-1";
    
    const defaultKidPhoto = isKhitan ? `/templates/${activeTheme}/kid.png` 
      : activeTheme === "birthday-8" ? "/templates/birthday-8/kid-1.jpg" 
      : activeTheme === "birthday-5" ? "/templates/birthday-5/kid-1.jpg" 
      : activeTheme === "birthday-1" ? "/templates/birthday-1/kid-1.jpg" 
      : "/templates/birthday-2/kid-1.jpg";
      
    const absoluteDefaultKidPhoto = `https://bintarti.store${defaultKidPhoto}`;

    // Determine the OG image
    let ogImage = invitation.child_photo_url || invitation.layout_config?.cover?.bgUrl;
    if (!ogImage && invitation.gallery_images && invitation.gallery_images.length > 0) {
      ogImage = invitation.gallery_images[0];
    }
    if (!ogImage) {
      ogImage = absoluteDefaultKidPhoto;
    }
    
    // Determine title
    const childName = invitation.full_name || 'Tamu Undangan';
    const typeMap: Record<string, string> = {
      "Birthday": "Ulang Tahun",
      "Khitan": "Khitan",
      "Aqiqah": "Aqiqah",
      "Wedding": "Pernikahan"
    };
    const invType = typeMap[invitation.type] || invitation.type || "Spesial";
    const title = `Undangan ${invType}: ${childName}`;
    
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
      description = `Acara: ${childName} pada ${eventDate}`;
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage, width: 800, height: 600, alt: title }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImage ? [ogImage] : [],
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
  return <>{children}</>;
}
