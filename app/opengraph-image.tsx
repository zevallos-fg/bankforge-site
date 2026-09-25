import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from './lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Tiqsi.ai — see your public presence the way an examiner does';

export default function Image() {
  return ogImage({
    eyebrow: 'Compliance and AI visibility',
    title: 'See your public presence the way an examiner does.',
  });
}
