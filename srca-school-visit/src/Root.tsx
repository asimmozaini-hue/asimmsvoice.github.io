import {Composition, Folder} from 'remotion';
import {SchoolVisit} from './SchoolVisit';
import {TitleCard} from './TitleCard';
import {VisitScene} from './VisitScene';

// 74s of scenes minus seven 15-frame transitions.
export const RemotionRoot = () => (
  <>
    <Composition
      id="SchoolVisit"
      component={SchoolVisit}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={2115}
    />
    <Folder name="Scenes">
      <Composition
        id="VisitScene"
        component={VisitScene}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={300}
        defaultProps={{
          step: 'المحطة ١',
          title: 'استقبال الطلاب',
          subtitle: 'رحّب فريق الهيئة بطلاب المدرسة في جولة تعريفية ممتعة',
          photo1: '',
          photo2: '',
          style: {backgroundColor: '#000000'},
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
