import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_FYkpjdZeY0ri27kqdqCviMDqG8A=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const imageKitFormData = new FormData();
    imageKitFormData.append('file', file);
    imageKitFormData.append('fileName', (file as File).name || 'product_image.jpg');

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      body: imageKitFormData
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: 'Upload failed', error: data }, { status: response.status });
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
