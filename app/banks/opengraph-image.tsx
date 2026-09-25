import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '../lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Tiqsi.ai for banks and credit unions';

export default function Image() {
  return ogImage({
    eyebrow: 'Banks and credit unions',
    title: 'The disclosures an examiner can check without asking you.',
  });
}
