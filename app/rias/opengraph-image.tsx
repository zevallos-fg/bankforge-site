import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '../lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Tiqsi.ai for investment advisers';

export default function Image() {
  return ogImage({
    eyebrow: 'Investment advisers',
    title: 'The Marketing Rule, read off your own website.',
  });
}
