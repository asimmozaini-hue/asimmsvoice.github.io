import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {useVideoConfig} from 'remotion';
import {TitleCard} from './TitleCard';
import {DARK_RED, RED} from './theme';
import {VisitScene} from './VisitScene';

export const SchoolVisit = () => {
  const {fps} = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Intro" durationInFrames={5 * fps}>
        <TitleCard
          name="Intro card"
          kicker="هيئة الهلال الأحمر السعودي"
          title="زيارة مدرسية"
          subtitle="منطقة المدينة المنورة"
          footer="أطفالنا… مسعفو المستقبل"
          style={{background: `linear-gradient(170deg, ${RED}, ${DARK_RED})`}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Welcome" durationInFrames={8 * fps}>
        <VisitScene
          name="Welcome scene"
          step="المحطة ١"
          title="استقبال الطلاب"
          subtitle="رحّب فريق الهيئة بطلاب المدرسة في جولة تعريفية ممتعة"
          photo1=""
          photo2=""
          style={{backgroundColor: '#000000'}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Programs" durationInFrames={11 * fps}>
        <VisitScene
          name="Programs scene"
          step="المحطة ٢"
          title="برامج الهيئة"
          subtitle="تعرّف الأطفال على خدمات الهلال الأحمر ودوره في إنقاذ الأرواح"
          photo1=""
          photo2=""
          style={{backgroundColor: '#000000'}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="First aid" durationInFrames={13 * fps}>
        <VisitScene
          name="First aid scene"
          step="المحطة ٣"
          title="مهارات الإسعافات الأولية"
          subtitle="نبذة سريعة عن خطوات بسيطة تُنقذ حياة، أولها الاتصال بـ 997"
          photo1=""
          photo2=""
          style={{backgroundColor: '#000000'}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Ambulance" durationInFrames={11 * fps}>
        <VisitScene
          name="Ambulance scene"
          step="المحطة ٤"
          title="نموذج سيارة الإسعاف"
          subtitle="جولة داخل سيارة الإسعاف والتعرّف على تجهيزاتها"
          photo1=""
          photo2=""
          style={{backgroundColor: '#000000'}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Simulation room" durationInFrames={11 * fps}>
        <VisitScene
          name="Simulation scene"
          step="المحطة ٥"
          title="غرفة المحاكاة"
          subtitle="تجربة عملية لمواقف إسعافية في بيئة تدريب آمنة"
          photo1=""
          photo2=""
          style={{backgroundColor: '#000000'}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Gifts" durationInFrames={9 * fps}>
        <VisitScene
          name="Gifts scene"
          step="ختام الزيارة"
          title="هدايا تذكارية"
          subtitle="تسليم الطلاب هدايا تذكارية تخليداً لهذا اليوم"
          photo1=""
          photo2=""
          style={{backgroundColor: '#000000'}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Outro" durationInFrames={6 * fps}>
        <TitleCard
          name="Outro card"
          kicker="هيئة الهلال الأحمر السعودي"
          title="شكراً لأبطالنا الصغار"
          subtitle="معاً نصنع جيلاً واعياً بالإسعافات الأولية"
          footer="للطوارئ اتصل 997"
          style={{background: `linear-gradient(170deg, ${RED}, ${DARK_RED})`}}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
