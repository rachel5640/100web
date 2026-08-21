import styled from 'styled-components';

import InfiniteGallery from '../components/InfiniteGallery';
import Preloader from '../components/Preloader';
// import { introText } from '../data/intro';

const MainPage = () => {
  return (
    <>
      <Preloader />
      <TextWrapper>
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
      </TextWrapper>
      <InfiniteGallery />
    </>
  );
};

const TextWrapper = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  display: flex;
  z-index: 500;
  gap: 8rem;
  pointer-events: none;

  @media (max-width: 720px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const TitleText = styled.h2`
  ${({ theme }) => theme.fonts.Text01};
  line-height: 1.4;
  min-width: 20rem;
`;

const IntroText = styled.div`
  z-index: 500;
  pointer-events: none;
  min-width: 20rem;

  ${({ theme }) => theme.fonts.Text01};

  line-height: 1.4;
  color: ${({ theme }) => theme.colors.black};
`;

export default MainPage;
