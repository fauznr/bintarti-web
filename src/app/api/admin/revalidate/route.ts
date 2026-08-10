import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the cache for the entire site
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache situs berhasil dibersihkan.' 
    });
  } catch (error: any) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: 'Gagal membersihkan cache', details: error.message },
      { status: 500 }
    );
  }
}
