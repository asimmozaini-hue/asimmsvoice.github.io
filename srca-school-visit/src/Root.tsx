import {Composition, Folder} from 'remotion';
import {SchoolVisit} from './SchoolVisit';
import {TitleCard} from './TitleCard';
import {ZeerTribute} from './zeer/ZeerTribute';
import {MedgoFilm} from './medgo/MedgoFilm';
import {CrashCourse2} from './cc2/CrashCourse2';
import {PulseFilm} from './pulse/PulseFilm';
import {EvacFilm} from './evac/EvacFilm';
import {CarFilm} from './car/CarFilm';
import {StationCaption} from './StationCaption';

// 71s of scenes minus six 15-frame transitions.
export const RemotionRoot = () => (
  <>
    <Composition
      id="SchoolVisit"
      component={SchoolVisit}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={2040}
    />
    <Composition
      id="CarMG7"
      component={CarFilm}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={660}
    />
    <Composition
      id="EvacuationDrill"
      component={EvacFilm}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={2655}
    />
    <Composition
      id="SecondsOfLife"
      component={PulseFilm}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={3000}
    />
    <Composition
      id="CrashCourse2"
      component={CrashCourse2}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={3420}
    />
    <Composition
      id="MedgoFilm"
      component={MedgoFilm}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={3420}
    />
    <Composition
      id="ZeerTribute"
      component={ZeerTribute}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1620}
    />
    <Folder name="Scenes">
      <Composition
        id="StationCaption"
        component={StationCaption}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={300}
        defaultProps={{
          step: 'المحطة ١',
          title: 'استقبال الطلاب',
          subtitle: 'رحّب فريق الهيئة بطلاب المدرسة في جولة تعريفية ممتعة',
        }}
      />
      <Composition
        id="TitleCard"
        component={TitleCard}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={150}
        defaultProps={{
          kicker: 'هيئة الهلال الأحمر السعودي',
          title: 'زيارة مدرسية',
          subtitle: 'منطقة المدينة المنورة',
          footer: 'أطفالنا… مسعفو المستقبل',
          style: {background: 'linear-gradient(170deg, #D71920, #9E0F14)'},
        }}
      />
    </Folder>
  </>
);
