import styled from 'styled-components';

import InfiniteGallery from '../components/InfiniteGallery';
import Preloader from '../components/Preloader';
// import { introText } from '../data/intro';

const MainPage = () => {
  return (
    <>
      <Preloader />
      <TitleText>
        100 프로젝트
        <br />
        사회문화적디자인스튜디오(3)
        <br />
        Research Design Studio(3)
      </TitleText>

      <IntroText>
        2026 © Hongik University <br />
        Dept. of Visual Communication Design. <br />
        All Rights Reserved
      </IntroText>
      <InfiniteGallery />
    </>
  );
};

const TitleText = styled.h2`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 500;
  pointer-events: none;
  ${({ theme }) => theme.fonts.Text01};
  line-height: 1.4;
  min-width: 20rem;

  @media (max-width: 720px) {
    max-width: calc(100vw - 10rem);
    font-size: 1rem;
    top: 1rem;
  }
`;

const IntroText = styled.div`
  position: fixed;
  top: 2rem;
  left: 20%;
  z-index: 500;
  pointer-events: none;
  min-width: 20rem;

  ${({ theme }) => theme.fonts.Text01};

  line-height: 1.4;
  color: ${({ theme }) => theme.colors.black};

  @media (max-width: 720px) {
    max-width: calc(100vw - 10rem);
    font-size: 1rem;
    top: 6.5rem;
    left: 2rem;
  }
`;

export default MainPage;
