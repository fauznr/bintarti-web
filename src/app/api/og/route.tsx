import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { supabase } from '../../../utils/supabase';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Missing id parameter', { status: 400 });
    }

    // Ambil data undangan dari Supabase
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select('type, full_name, event_date, child_photo_url, notes, theme')
      .eq('id', id)
      .single();

    if (error || !invitation) {
      // Return default image if not found
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
              backgroundSize: '100px 100px',
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 800, color: '#ec4899' }}>
              Bintarti
            </div>
            <div style={{ fontSize: 32, marginTop: 16, color: '#475569' }}>
              Undangan Digital
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const isWedding = invitation.type?.toLowerCase().includes('wedding');
    const isBirthday = invitation.type?.toLowerCase().includes('birthday');
    
    // Parse wedding data if applicable
    let weddingNotes: any = {};
    if (isWedding && invitation.notes) {
      try {
        weddingNotes = typeof invitation.notes === 'string' ? JSON.parse(invitation.notes) : invitation.notes;
      } catch (e) {}
    }

    // Extract Data
    const title = invitation.full_name || 'Undangan';
    const subTitle = isWedding ? 'The Wedding of' : isBirthday ? 'Birthday Celebration' : `Tasyakuran ${invitation.type || ''}`;
    const dateStr = invitation.event_date || '';
    
    // Determine Photo
    let photoUrl = invitation.child_photo_url;
    if (isWedding && weddingNotes.photoHeroUrl) {
      photoUrl = weddingNotes.photoHeroUrl;
    }
    
    // Style configurations based on event type
    let bgColor1 = '#ffffff';
    let bgColor2 = '#f8fafc'; // Default subtle gradient
    let textColor = '#1e293b';
    let accentColor = '#ec4899'; // Pinkish
    let fontName = 'Serif';

    if (isWedding) {
      bgColor1 = '#fafaf9'; // Warm stone
      bgColor2 = '#f5f5f4';
      textColor = '#44403c';
      accentColor = '#a8a29e'; // Soft gold/taupe
    } else if (isBirthday) {
      bgColor1 = '#fdf2f8'; // Pinkish
      bgColor2 = '#fbcfe8';
      textColor = '#831843';
      accentColor = '#f472b6';
      fontName = 'Sans-serif';
    } else {
      // Khitan / Aqiqah (Islamic/General)
      bgColor1 = '#f0fdf4'; // Greenish
      bgColor2 = '#dcfce7';
      textColor = '#14532d';
      accentColor = '#22c55e';
      fontName = 'Serif';
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            backgroundColor: bgColor1,
            backgroundImage: `linear-gradient(to bottom right, ${bgColor1}, ${bgColor2})`,
            fontFamily: fontName,
            overflow: 'hidden',
          }}
        >
          {/* Decorative Corner Elements */}
          <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', backgroundColor: accentColor, opacity: 0.1 }} />
          <div style={{ position: 'absolute', bottom: -150, right: -150, width: 600, height: 600, borderRadius: '50%', backgroundColor: accentColor, opacity: 0.05 }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              padding: '60px',
              gap: '40px',
            }}
          >
            {/* Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
              <span style={{ fontSize: 32, letterSpacing: '4px', textTransform: 'uppercase', color: accentColor, marginBottom: '20px', fontWeight: 600 }}>
                {subTitle}
              </span>
              <span style={{ fontSize: 72, fontWeight: 800, color: textColor, lineHeight: 1.1, marginBottom: '24px' }}>
                {title}
              </span>
              {dateStr && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ width: '40px', height: '4px', backgroundColor: accentColor, marginRight: '20px' }} />
                  <span style={{ fontSize: 28, color: textColor, opacity: 0.8, fontWeight: 500 }}>
                    {dateStr}
                  </span>
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', paddingTop: '40px' }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: accentColor }}>Bintarti</span>
                <span style={{ fontSize: 24, color: textColor, opacity: 0.5, marginLeft: '8px' }}>• Digital Invitation</span>
              </div>
            </div>

            {/* Right Photo */}
            {photoUrl && (
              <div
                style={{
                  display: 'flex',
                  width: '450px',
                  height: '500px',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  border: `8px solid ${bgColor1}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}
            {!photoUrl && (
              <div
                style={{
                  display: 'flex',
                  width: '450px',
                  height: '500px',
                  borderRadius: '32px',
                  backgroundColor: accentColor,
                  opacity: 0.1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Fallback pattern */}
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`Failed to generate OG image: ${e.message}`);
    return new Response('Failed to generate image', { status: 500 });
  }
}
