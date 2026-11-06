import {Video} from '@remotion/media';
import {staticFile, Track, useVideoConfig} from 'remotion';
import {FaceBadge} from './FaceBadge';
import {PortraitCard} from './PortraitCard';

export const ZeerTribute = () => {
  const {fps} = useVideoConfig();

  return (
    <>
      <Video name="Zeer dance" src={staticFile('zeer/zeer.mp4')} />
      <Track name="Portrait badge">
        <FaceBadge name="Badge 1" caption="" from={4 * fps} durationInFrames={18 * fps} />
        <FaceBadge name="Badge 2" caption="" from={25 * fps} durationInFrames={13 * fps} />
        <FaceBadge name="Badge 3" caption="" from={41 * fps} durationInFrames={9 * fps} />
      </Track>
      <Track name="Portrait cutaways">
        <PortraitCard name="Opening portrait" title="ليلة زير" subtitle="من فنون المدينة المنورة الشعبية" durationInFrames={4.5 * fps} />
        <PortraitCard name="Cutaway 1" title="" subtitle="" from={21.5 * fps} durationInFrames={4 * fps} />
        <PortraitCard name="Cutaway 2" title="" subtitle="" from={37.5 * fps} durationInFrames={4 * fps} />
        <PortraitCard name="Closing portrait" title="الزير… فنٌّ وتراث" subtitle="المدينة المنورة" from={49.5 * fps} durationInFrames={4.5 * fps} />
      </Track>
    </>
  );
};
