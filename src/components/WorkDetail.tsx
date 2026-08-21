import styled from 'styled-components';

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

const WorkDetail = ({ work }: WorkDetailProps) => {
  const contacts = parseContacts(work.contact);
  const instagram = contacts.find((contact) => contact.type === 'instagram');
  const otherContacts = contacts.filter((contact) => contact.type !== 'instagram');
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
            <InstagramHandle href={instagram.href} target="_blank" rel="noreferrer">
              {instagram.label}
            </InstagramHandle>
          )}
        </Eyebrow>
      </Header>

      <ImageColumn>
        {images.map((src, index) => (
          <GalleryImage
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
            <DescriptionEn key={`en-${index}`}>{paragraph}</DescriptionEn>
          ))}
        </DescriptionBlock>

        {(otherContacts.length > 0 || (linkKind === 'website' && work.link)) && (
          <LinkRow>
            {otherContacts.map((contact) => (
              <LinkPill key={contact.href} href={contact.href} rel="noreferrer">
                Mail to
              </LinkPill>
            ))}
            {linkKind === 'website' && work.link && (
              <LinkPill href={work.link} target="_blank" rel="noreferrer">
                Website
              </LinkPill>
            )}
          </LinkRow>
        )}
      </Info>
    </>
  );
};

const Header = styled.div`
  grid-area: header;
  padding: 4rem 4rem 0;
  text-align: left;

  h2 {
    white-space: pre-line;
    ${({ theme }) => theme.fonts.Title01};
  }

  @media (max-width: 720px) {
    padding: 2rem 1.5rem 0;
  }
`;

const ImageColumn = styled.div`
  grid-area: images;
  display: flex;
  flex-direction: column;

  min-height: 0; /* flex items default to min-height: auto, which blocks overflow-y from ever scrolling */
  overflow-y: scroll;

  @media (max-width: 720px) {
    min-height: auto;
    overflow-y: visible;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  display: block;
`;

const Info = styled.div`
  grid-area: details;
  padding: 2rem 4rem 4rem;
  overflow-y: auto;
  min-height: 0;
  text-align: left;

  @media (max-width: 720px) {
    padding: 1.5rem;
    overflow-y: visible;
  }
`;

const Eyebrow = styled.p`
  margin: 0 0 0.4rem;

  ${({ theme }) => theme.fonts.Text01};
`;

const InstagramHandle = styled.a`
  margin-left: 0.8rem;
  color: ${({ theme }) => theme.colors.black};

  &:hover {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const LinkPill = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  border: 0.1rem solid ${({ theme }) => theme.colors.border};
  border-radius: 99.9rem;
  font-size: 0.85em;

  ${({ theme }) => theme.fonts.Text01};

  &:hover {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

const DescriptionBlock = styled.div`
  margin-bottom: 1.5em;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Description = styled.p`
  margin: 0 0 1em;
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
