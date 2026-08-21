import styled from 'styled-components';

import InfiniteGallery from '../components/InfiniteGallery';
import Preloader from '../components/Preloader';
// import { introText } from '../data/intro';

const MainPage = () => {
  return (
    <>
      <Preloader />
      <IntroText>
        2026 © Hongik University <br />
        Dept. of Visual Communication Design. <br />
        All Rights Reserved
      </IntroText>

      <InfiniteGallery />
    </>
  );
};

const IntroText = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 500;
  max-width: 26vw;
  pointer-events: none;

  ${({ theme }) => theme.fonts.Text01};

  line-height: 1.4;
  color: ${({ theme }) => theme.colors.black};

  p {
    margin-top: 0.6rem;
    font-size: 1rem;
  }

  @media (max-width: 720px) {
    max-width: calc(100vw - 10rem);
    font-size: 1rem;
    top: 1rem;
  }
`;

export default MainPage;
