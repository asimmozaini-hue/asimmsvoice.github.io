import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadTajawal} from '@remotion/google-fonts/Tajawal';

export const {fontFamily: arabicFont} = loadTajawal('normal', {
  weights: ['500', '800', '900'],
  subsets: ['arabic', 'latin'],
});

export const {fontFamily: latinFont} = loadMontserrat('normal', {
  weights: ['800', '900'],
  subsets: ['latin'],
});

export const RED = '#E1251B';
export const DEEP_RED = '#7A0C0C';
export const INK = '#0B0B0D';
