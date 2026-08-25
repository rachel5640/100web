import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import closeIcon from '../assets/icon/closeicon.svg';
import listIcon from '../assets/icon/listicon.svg';
import { type Work, works } from '../data/works';

interface WorkListPanelProps {
  // eslint-disable-next-line no-unused-vars
  onSelect: (work: Work) => void;
}

const WorkListPanel = ({ onSelect }: WorkListPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredWorks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return works;
    return works.filter(
      (work) => work.name.toLowerCase().includes(normalized) || work.title.toLowerCase().includes(normalized)
    );
  }, [query]);

  const closeDrawer = () => {
    setIsOpen(false);
    setQuery('');
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (work: Work) => {
    onSelect(work);
    closeDrawer();
  };

  return (
    <>
      <ToggleButton
        type="button"
        onClick={() => (isOpen ? closeDrawer() : setIsOpen(true))}
        aria-label={isOpen ? '목록 닫기' : '작품 목록'}>
        <img src={isOpen ? closeIcon : listIcon} alt="" />
      </ToggleButton>

      <Overlay $open={isOpen} onClick={closeDrawer} />

      <Drawer $open={isOpen}>
        <List>
          {filteredWorks.length === 0 && <Empty>검색 결과가 없습니다</Empty>}
          {filteredWorks.map((work) => (
            <ListItem key={work.id}>
              <button type="button" onClick={() => handleSelect(work)}>
                <ListName className="name">{work.name}</ListName>
                <ListTitle>{work.title}</ListTitle>
                <ListKeyword>{work.keyword}</ListKeyword>
              </button>
            </ListItem>
          ))}
        </List>
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름 또는 작품명 검색"
        />
      </Drawer>
    </>
  );
};

const ToggleButton = styled.button`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 900;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 3.5rem;
  }

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 720px) {
    top: 1.5rem;
    right: 1.5rem;
  }
`;

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 700;
  background: ${({ theme }) => theme.colors.overlay};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.35s ease;
`;

const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40vw;
  z-index: 800;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  background-color: ${({ theme }) => theme.colors.white};

  border-color: ${({ theme }) => theme.colors.lightgrey};

  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 720px) {
    width: 100%;
    padding-top: 0rem;
  }
`;

const List = styled.ul`
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

const ListName = styled.div`
  width: 20%;
  line-height: 1.45;
  padding: 0 1rem;
  white-space: pre-line;

  ${({ theme }) => theme.fonts.Text01};
  color: ${({ theme }) => theme.colors.black};
`;

const ListTitle = styled.div`
  ${({ theme }) => theme.fonts.Text01};

  padding-right: 2rem;
  width: 50%;
  line-height: 1.45;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.black};
`;

const ListKeyword = styled.div`
  ${({ theme }) => theme.fonts.Text01};
  width: 20%;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.black};
`;

const ListItem = styled.li`
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.black};
  padding: 0.2rem 0 0;

  button {
    display: flex;
    width: 100%;
    text-align: left;

    ${({ theme }) => theme.fonts.Text01};

    &:hover {
      color: ${({ theme }) => theme.colors.grey};
    }
  }

  @media (max-width: 720px) {
    padding: 0.4rem 0 0.1rem;
    &:first-child {
      margin-top: 1rem;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const Empty = styled.p`
  padding-left: 1.5rem;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.grey};
  ${({ theme }) => theme.fonts.Text01};
`;

const SearchInput = styled.input`
  border: none;
  border-top: 1px solid lightgrey;
  padding: 1rem 1.6rem;
  font-size: 1.4rem;
  ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.fonts.Text01};

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }

  /* iOS 사파리는 입력창 font-size가 16px 미만이면 포커스 시 화면을 확대한다 */
  @media (max-width: 720px) {
    font-size: 16px;
  }
`;

export default WorkListPanel;
