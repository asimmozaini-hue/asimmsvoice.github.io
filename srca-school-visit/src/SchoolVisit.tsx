import {Video} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {staticFile, Track, useVideoConfig} from 'remotion';
import {StationCaption} from './StationCaption';
import {StillPhoto} from './StillPhoto';
import {TitleCard} from './TitleCard';

const OVERLAY = 'linear-gradient(170deg, rgba(215,25,32,0.62), rgba(120,10,15,0.85))';

export const SchoolVisit = () => {
  const {fps} = useVideoConfig();

  return (
    <TransitionSeries name="Visit">
      <TransitionSeries.Sequence name="Intro" durationInFrames={5 * fps}>
        <Video name="Center exterior" src={staticFile('clips/IMG_1911.mp4')} volume={0.3} />
        <TitleCard
          name="Intro card"
          kicker="هيئة الهلال الأحمر السعودي"
          title="زيارة مدرسية"
          subtitle="منطقة المدينة المنورة"
          footer="أطفالنا… مسعفو المستقبل"
          style={{background: OVERLAY}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Welcome" durationInFrames={12 * fps}>
        <Track name="Welcome shots">
          <Video name="Entering 1" src={staticFile('clips/IMG_1915.mp4')} durationInFrames={2.5 * fps} volume={0.4} />
          <Video name="Entering 2" src={staticFile('clips/IMG_1916.mp4')} from={2.5 * fps} durationInFrames={3.5 * fps} volume={0.4} />
          <Video name="Holding hands" src={staticFile('clips/IMG_1930.mp4')} from={6 * fps} durationInFrames={2.5 * fps} volume={0.4} />
          <Video name="Into the hall" src={staticFile('clips/IMG_1934.mp4')} from={8.5 * fps} trimBefore={1 * fps} durationInFrames={3.5 * fps} volume={0.4} />
        </Track>
        <StationCaption
          name="Welcome caption"
          step="المحطة ١"
          title="استقبال الطلاب"
          subtitle="رحّب فريق الهيئة بطلاب المدرسة في جولة تعريفية ممتعة"
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Programs" durationInFrames={13.5 * fps}>
        <Track name="Programs shots">
          <Video name="Lined up" src={staticFile('clips/IMG_1921.mp4')} trimBefore={1 * fps} durationInFrames={3 * fps} volume={0.4} />
          <Video name="Classroom 1" src={staticFile('clips/IMG_1935.mp4')} from={3 * fps} trimBefore={1 * fps} durationInFrames={4 * fps} volume={0.4} />
          <Video name="Classroom 2" src={staticFile('clips/IMG_1942.mp4')} from={7 * fps} trimBefore={1 * fps} durationInFrames={4 * fps} volume={0.4} />
          <StillPhoto name="Smiling student" src="clips/smiling-girl.jpg" fit="cover" from={11 * fps} durationInFrames={2.5 * fps} />
        </Track>
        <StationCaption
          name="Programs caption"
          step="المحطة ٢"
          title="برامج الهيئة"
          subtitle="تعرّف الأطفال على خدمات الهلال الأحمر ودوره في إنقاذ الأرواح"
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="First aid" durationInFrames={12 * fps}>
        <Track name="First aid shots">
          <Video name="Instructor demo" src={staticFile('clips/IMG_1937.mp4')} durationInFrames={3 * fps} volume={0.4} />
          <Video name="Choking relief demo" src={staticFile('clips/IMG_1945.mp4')} from={3 * fps} trimBefore={1 * fps} durationInFrames={9 * fps} volume={0.4} />
        </Track>
        <StationCaption
          name="First aid caption"
          step="المحطة ٣"
          title="مهارات الإسعافات الأولية"
          subtitle="نبذة سريعة عن خطوات بسيطة تُنقذ حياة، أولها الاتصال بـ 997"
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Ambulance" durationInFrames={13 * fps}>
        <Track name="Ambulance shots">
          <Video name="Ambulance 1" src={staticFile('clips/IMG_1922.mp4')} trimBefore={1 * fps} durationInFrames={4.5 * fps} volume={0.4} />
          <Video name="Ambulance 2" src={staticFile('clips/IMG_1923.mp4')} from={4.5 * fps} durationInFrames={3.5 * fps} volume={0.4} />
          <Video name="Ambulance 3" src={staticFile('clips/IMG_1924.mp4')} from={8 * fps} trimBefore={1 * fps} durationInFrames={5 * fps} volume={0.4} />
        </Track>
        <StationCaption
          name="Ambulance caption"
          step="المحطة ٤"
          title="نموذج سيارة الإسعاف"
          subtitle="جولة داخل سيارة الإسعاف والتعرّف على تجهيزاتها"
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Simulation room" durationInFrames={14 * fps}>
        <Track name="Simulation shots">
          <Video name="Simulation 1" src={staticFile('clips/IMG_1938.mp4')} trimBefore={2 * fps} durationInFrames={4 * fps} volume={0.4} />
          <StillPhoto name="Accident scene group" src="clips/group-row.jpg" fit="contain" from={4 * fps} durationInFrames={3 * fps} />
          <StillPhoto name="Accident scene close" src="clips/group-close.jpg" fit="cover" from={7 * fps} durationInFrames={2.5 * fps} />
          <Video name="Simulation 2" src={staticFile('clips/IMG_1953.mp4')} from={9.5 * fps} durationInFrames={4.5 * fps} volume={0.4} />
        </Track>
        <StationCaption
          name="Simulation caption"
          step="المحطة ٥"
          title="غرفة المحاكاة"
          subtitle="تجربة عملية لمواقف إسعافية في بيئة تدريب آمنة"
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Gifts" durationInFrames={6 * fps}>
        <Video name="Group lineup" src={staticFile('clips/IMG_1919.mp4')} durationInFrames={6 * fps} volume={0.3} />
        <TitleCard
          name="Gifts card"
          kicker="ختام الزيارة"
          title="هدايا تذكارية"
          subtitle="تسليم الطلاب هدايا تذكارية تخليداً لهذا اليوم"
          footer=""
          style={{background: 'linear-gradient(170deg, rgba(215,25,32,0.55), rgba(120,10,15,0.75))'}}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Outro" durationInFrames={6 * fps}>
        <Video name="Group at the center" src={staticFile('clips/IMG_1911.mp4')} trimBefore={4 * fps} durationInFrames={6 * fps} volume={0.3} />
        <TitleCard
          name="Outro card"
          kicker="هيئة الهلال الأحمر السعودي"
          title="شكراً لأبطالنا الصغار"
          subtitle="معاً نصنع جيلاً واعياً بالإسعافات الأولية"
          footer="للطوارئ اتصل 997"
          style={{background: OVERLAY}}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
