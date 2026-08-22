import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import type { Work } from '../data/works';
import { parseContacts } from '../utils/contact';
import { getLinkKind, getVideoEmbedUrl } from '../utils/link';

interface WorkDetailProps {
  work: Work;
}

// paragraphs were separated with newlines in the source data; render each
// as its own indented block instead of preserving the raw line breaks
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

// English descriptions mark work/publication titles with *asterisks*
// (Korean uses 〈〉《》 quote brackets instead) — render those as italics
function renderItalicized(text: string) {
  return text.split(/\*(.+?)\*/g).map((segment, index) => (index % 2 === 1 ? <em key={index}>{segment}</em> : segment));
}

interface DetailImageProps {
  src: string;
  alt: string;
  loading?: 'lazy';
}

const DetailImage = ({ src, alt, loading }: DetailImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <ImageWrapper $loaded={loaded}>
      {!loaded && <Loader />}
      <GalleryImage src={src} alt={alt} loading={loading} $loaded={loaded} onLoad={() => setLoaded(true)} />
    </ImageWrapper>
  );
};

const WorkDetail = ({ work }: WorkDetailProps) => {
  const contacts = parseContacts(work.contact);
  const instagram = contacts.find((contact) => contact.type === 'instagram');
  const emails = contacts.filter((contact) => contact.type === 'email');
  const linkKind = work.link ? getLinkKind(work.link) : null;
  const videoEmbedUrl = linkKind === 'video' && work.link ? getVideoEmbedUrl(work.link) : null;
  // detail images take over once they exist; the thumbnail is just a
  // placeholder for works that haven't gotten any yet
  const images = work.detailImages.length > 0 ? work.detailImages : [work.thumbnail];

  return (
    <>
      <Header>
        <h2>{work.title}</h2>
        <Eyebrow>
          {work.name}
          {instagram && (
            <ContactHandle href={instagram.href} target="_blank" rel="noreferrer">
              {instagram.label}
            </ContactHandle>
          )}
          {emails.map((contact) => (
            <ContactHandle key={contact.href} href={contact.href} rel="noreferrer">
              {contact.label}
            </ContactHandle>
          ))}
        </Eyebrow>
      </Header>

      <ImageColumn>
        {images.map((src, index) => (
          <DetailImage
            key={src}
            src={src}
            alt={`${work.title} 이미지 ${index + 1}`}
            loading={index === 0 ? undefined : 'lazy'}
          />
        ))}
        {videoEmbedUrl && (
          <VideoEmbed>
            <iframe
              src={videoEmbedUrl}
              title={work.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoEmbed>
        )}
      </ImageColumn>

      <Info>
        <DescriptionBlock>
          {splitParagraphs(work.descriptionKo).map((paragraph, index) => (
            <Description key={`ko-${index}`}>{paragraph}</Description>
          ))}
        </DescriptionBlock>
        <DescriptionBlock>
          {splitParagraphs(work.descriptionEn).map((paragraph, index) => (
            <DescriptionEn key={`en-${index}`}>{renderItalicized(paragraph)}</DescriptionEn>
          ))}
        </DescriptionBlock>

        {linkKind === 'website' && work.link && (
          <WebsiteLink href={work.link} target="_blank" rel="noreferrer">
            Website
          </WebsiteLink>
        )}
      </Info>
    </>
  );
};

const Header = styled.div`
  grid-area: header;
  padding: 3rem 6rem 0 2rem;
  text-align: left;

  h2 {
    white-space: pre-line;
    line-height: 130%;

    ${({ theme }) => theme.fonts.Title01};

    @media (max-width: 720px) {
      font-size: 2.2rem;
      padding-right: 5rem;
    }
  }

  @media (max-width: 720px) {
    position: sticky;
    top: 0;
    padding: 2rem 1.5rem 0;
    background: ${({ theme }) => theme.colors.white};
  }
`;

const ImageColumn = styled.div`
  grid-area: images;
  display: flex;
  flex-direction: column;

  min-height: 0;
  overflow-y: scroll;

  @media (max-width: 720px) {
    min-height: auto;
    overflow-y: visible;
  }
`;

const ImageWrapper = styled.div<{ $loaded: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GalleryImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  display: block;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const loaderPulse = keyframes`
  50% {
    box-shadow: 19px 0 0 3px, 38px 0 0 7px, 57px 0 0 3px;
  }
  100% {
    box-shadow: 19px 0 0 0, 38px 0 0 3px, 57px 0 0 7px;
  }
`;

const Loader = styled.span`
  position: absolute;
  color: ${({ theme }) => theme.colors.lightgrey};
  width: 4px;
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow:
    19px 0 0 7px,
    38px 0 0 3px,
    57px 0 0 0;
  transform: translateX(-38px);
  animation: ${loaderPulse} 0.5s infinite alternate linear;
`;

const Info = styled.div`
  grid-area: details;

  padding: 4rem 6rem 4rem 2rem;
  overflow-y: auto;
  text-align: left;

  @media (max-width: 720px) {
    padding: 1.5rem;
    overflow-y: visible;
  }

  @media (max-width: 720px) {
    padding-bottom: 8rem;
  }
`;

const Eyebrow = styled.p`
  margin: 0.7rem 0rem;

  ${({ theme }) => theme.fonts.Text01};
`;

const ContactHandle = styled.a`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.colors.grey};
  ${({ theme }) => theme.fonts.Text01};

  &:hover {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

const WebsiteLink = styled.a`
  display: inline-block;
  margin-top: 1.5rem;

  ${({ theme }) => theme.fonts.Text01};
  color: ${({ theme }) => theme.colors.black};
  text-decoration: underline;
  text-underline-offset: 0.3rem;

  &:hover {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

const DescriptionBlock = styled.div`
  margin-bottom: 1rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Description = styled.p`
  ${({ theme }) => theme.fonts.Text01};

  &:last-child {
    margin-bottom: 0;
  }
`;

const DescriptionEn = styled(Description)`
  font-size: 0.9em;
  ${({ theme }) => theme.fonts.Text01};
  color: ${({ theme }) => theme.colors.grey};
  line-height: 145%;
`;

const VideoEmbed = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

export default WorkDetail;
