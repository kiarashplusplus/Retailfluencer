import QRCode from 'qrcode';

/**
 * Generate a QR code as a base64 data URL
 */
export async function generateQRCode(data: string): Promise<string> {
    const options = {
        errorCorrectionLevel: 'H' as const,
        type: 'image/png' as const,
        margin: 2,
        width: 300,
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    };

    return QRCode.toDataURL(data, options);
}

/**
 * Generate a QR code as SVG string
 */
export async function generateQRCodeSVG(data: string): Promise<string> {
    return QRCode.toString(data, { type: 'svg' });
}
