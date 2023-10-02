import { useFeeneyStore } from '../store/store';

export const setParamsDependencies = () => {
  const {
    railingType,
    setCornerPosts,
    postMounting,
    setPostMounting,
    setTopRail,
    railingHeight,
    setRailingHeight,
  } = useFeeneyStore.getState();
  if (railingType.includes('Wood')) {
    setCornerPosts('Double');
    setPostMounting('Fascia Mount');
    setTopRail('Wood 2x4');
  } else if (railingType.includes('Steel round tubular')) {
    setTopRail('Steel Tubular');
    setPostMounting('Fascia Mount');
  } else if (railingType.includes('Steel flat bar')) {
    setTopRail('Steel Flatbar');
    setPostMounting('Fascia Mount');
  } else if (railingType.includes('Composite')) {
    setTopRail('CompositeTop');
    setPostMounting('Core Mount');
  } else if (railingType.includes('DesignRail')) {
    setCornerPosts('Single');
  }
};
